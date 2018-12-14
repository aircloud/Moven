import { getDomPath, getAttr } from './utils.js';

// 事件级映射
const EventsMap = {
    'click': {
        attrs: [''],
        computes: { // 类似于计算属性
            'targetDomPath': getDomPath
        },
        target: () => { return [window.document] },
        listeners: [
            {
                name: 'click'
                // 这里可以定义一些私有的 attrs、computes
            }
        ],
    },
    'form.input': {
        attrs:['target.value'],
        computes: { // 类似于计算属性
            'targetDomPath': getDomPath
        },
        target: () => { return document.querySelectorAll('input') },
        filter: (item) => {
            if (typeof item.type === 'undefined') {
                return true;
            }
            return (['text', 'date', 'datetime-local','color', 'email', 'range', 'month', 'number', 'password', 'search', 'tel', 'time', 'url', 'week'].indexOf(item.type) !== -1);
        },
        listeners: [
            {
                name: 'input',
            },
            {
                name: 'focus',
            },
            {
                name: 'compositionstart',
                opts: { // 只是对其监听但是不做记录，可以消除一定的相关影响
                    log: false
                }
            },
            {
                name: 'compositionend',
                opts: {
                    log: false
                }
            },
            {
                name: 'blur',
            },
        ]
    },
    'keyboard': {
        attrs:['code', 'keyCode'],
        computes: { // 类似于计算属性
            'targetDomPath': getDomPath
        },
        target: () => { return [window.document] },
        listeners: [
            {
                name: 'keydown'
            }
        ]
    }
};

export default class Moven {
    constructor(opts = {}) {
        this.compositionStart = false; // 在 Enter 模拟提交的时候，这个项目会有用
        this.inputing = false; // 是否正在输入
        this.eventsMap = Object.assign({}, EventsMap, opts.eventsMap ? opts.eventsMap : {});
        this.timeStart = Date.now();
        this.logs = [];
        this.begin = true;
        this.ifBoot = false;
        this.beginTime = 0; // 初始值设置为 0 是为了兼容
    }

    defaultHook(eventKey, listener, e) { // 默认的钩子函数，如果返回了 false，说明这个事件需要被抛弃掉
        if(eventKey === 'form.input' && listener.name === 'focus') {
            this.inputing = true;
        }
        if(eventKey === 'form.input' && listener.name === 'compositionstart') {
            this.compositionStart = true;
        }
        if(eventKey === 'form.input' && listener.name === 'blur') {
            this.inputing = false;
        }
        if(eventKey === 'form.input' && listener.name === 'compositionend') {
            this.compositionStart = false;
        }

        if(eventKey === 'keyboard') {
            if(this.inputing) {
                if(this.compositionStart) {
                    return false;
                } else {
                    return e.code === 'Enter'
                }
            }
        }

        return true;
    }

    getLastTimeStamp() {
        if(this.logs.length) {
            return this.logs[this.logs.length - 1].timeStamp || this.beginTime;
        }
        return this.beginTime;
    }

    boot() {
        if(this.ifBoot) return; // boot 只能最多执行一次
        if(!this.href) this.href = window.location.href;
        this.begin = true;
        let events = Object.keys(this.eventsMap);
        this.beginTime = Date.now();
        for(let eventKey of events) {
            if(!this.eventsMap.hasOwnProperty(eventKey)) {
                continue;
            }
            let target = this.eventsMap[eventKey].target();

            if(this.eventsMap[eventKey].filter && typeof this.eventsMap[eventKey].filter === 'function') {
                target = target.filter(this.eventsMap[eventKey].filter);
                console.log('对所选元素进行进一步的筛选：', target)
            }

            target.forEach((eachTarget, index) => {
                for(let listener of this.eventsMap[eventKey].listeners) {
                    console.log('eachTarget:', eachTarget);
                    if (eachTarget.addEventListener) {
                        eachTarget.addEventListener(listener.name, (e) => {
                            if(!this.begin) return; // 如果处于暂停状态，那么不进行任何操作

                            if(!this.defaultHook(eventKey, listener, e)) {
                                return;
                            }
                            if(listener.opts && !listener.opts.log) {
                                return; // 说明只执行钩子不执行具体的日志写入
                            }
                            let log = {
                                attrs: {},
                                computes: {}
                            };
                            let attrs = this.eventsMap[eventKey].attrs;
                            let computes = this.eventsMap[eventKey].computes;
                            if(listener.attrs) attrs = attrs.concat(listener.attrs);
                            if(listener.computes) computes = Object.assign({}, computes, listener.computes);
                            for(let attr of attrs) {
                                log['attrs'][attr] = getAttr(e, attr);
                            }
                            let computesKeys = Object.keys(computes);
                            for(let computesKey of computesKeys) {
                                log['computes'][computesKey] = computes[computesKey](e);
                            }
                            if(!this.logs.length) log.timeStamp = Date.now();
                            log.timeDelay = log.timeStamp - this.beginTime;
                            //
                            log.type = eventKey;
                            log.listener = listener.name;
                            log.href = window.location.href; // href 可能会变化
                            this.pushLog(log)
                        })
                    } else {
                        console.log('don\'t have event listener');
                    }
                }
            })
        }
    }

    pushLog(log = {}) {
        if(log.type === 'form.input' && log.listener === 'input') {
            let lastLog = this.logs[this.logs.length - 1];
            if(lastLog) {
                if(lastLog.type === log.type && lastLog.listener === log.listener) {
                    this.logs.pop();
                }
                this.logs.push(log);
            } else {
                this.logs.push(log)
            }
        } else {
            this.logs.push(log)
        }
    }

    clearLogs() {
        this.logs =[]
    }

    stop() {
        this.begin = false;
    }

    destory() {
        this.destory = true;
        // TODO 考虑是否删除事件监听
    }

    getLog() {
        return {
            href: this.href,
            list: this.logs
        }
    }
}

// TODO: 如果是后续增加的 input 等，可能没有办法监听到

// TODO：考虑优化 logs 的返回方式，增加 beginUrl 等属性值