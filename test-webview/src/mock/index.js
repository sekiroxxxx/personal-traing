//引入mockjs
import Mock, { mock } from 'mockjs';

//获取mock
const Random = Mock.Random;


// 考试信息数据
const { examInfo } = Mock.mock({
    'examInfo|1-3': [
        {
            "id": "@increment()",
            "title": "@ctitle(5)模拟考试",
            "time|59-3700": 3700
            // "time": 3
        }
    ]
});

//用户信息 
const { userinfo } = Mock.mock({
    'userinfo': [
        {
            "id|+1": 1,
            'name': '@cname(3)',
            'grade': '@cword("一二三四五六七八九")',
            'class|1-20': 20
        }
    ]
});

// 题目信息问题数据
//选择题
const { choiceQuestionInfo } = Mock.mock({
    'choiceQuestionInfo|9-12': [
        {
            "id|+1": 1,
            "title": "@cparagraph()",
            "score": "5",
            'answer|4': ["@ctitle"]
        }
    ]
});
//简答题
const { shortAnswernInfo } = Mock.mock({
    'shortAnswernInfo|2-3': [
        {
            "id|+1": 1,
            "title": "@cparagraph()",
            "score": "10"
        }
    ]
});
//填空题
const { fulfillInfo } = Mock.mock({
    'fulfillInfo|2-4': [
        {
            "id|+1": 1,
            "title": "@cparagraph()_______@ctitle(5)",
            "score": "5"
        }
    ]
});
//答案列表
const { answer } = Mock.mock({
    'answer': {
        "shortanswer": [],
        "fill": [],
        "choice": []
    }
})

//获取考试信息
Mock.mock('\/api\/get\/exam', 'get', () => {
    return {
        code: '0',
        message: '获取考试信息成功',
        list: examInfo,
        total: examInfo.length
    }
});
//获取选择题模拟数据
Mock.mock('\/api\/get\/choicequestion', 'get', () => {
    return {
        code: '0',
        message: 'success',
        list: choiceQuestionInfo,
        total: choiceQuestionInfo.length
    }
});

//获取简答题模拟数据
Mock.mock('\/api\/get\/shortanswer', 'get', () => {
    return {
        code: '0',
        message: 'success',
        list: shortAnswernInfo,
        total: shortAnswernInfo.length
    }
});
//获取填空题模拟数据
Mock.mock('\/api\/get\/fulfill', 'get', () => {
    return {
        code: '0',
        message: 'success',
        list: fulfillInfo,
        total: fulfillInfo.length
    }
});
//获取用户信息
Mock.mock('\/api\/get\/userinfo', 'get', () => {
    return {
        code: '0',
        message: 'success',
        list: userinfo
    }
});
//接收保存的答案
Mock.mock('\/api\/post\/saveanswer', 'post', (options) => {
    const body = JSON.parse(options.body)
    answer.shortanswer = body.shortanswer;
    answer.fill = body.fill;
    answer.choice = body.choice;
    return {
        code: '0',
        message: 'success',
        list: answer
    }
})
//显示答案
Mock.mock('/api/get/showanswer', 'get', () => {
    return {
        code: '0',
        message: 'success',
        list: answer
    }
})

