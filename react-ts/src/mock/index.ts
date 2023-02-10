import { MockMethod } from "vite-plugin-mock";
import Mock from 'mockjs';
// mock @now 现在时间
const studentdata = Mock.mock({
  'studentdata|9-13': [
    {
      name:'@cname(3)',
      stuId: '@cword("0123456789",11) ',
      school: '福州@cword("一二三四五六七八九")中',
      stuClass: '@cword("一二三四五六七八九")年级(@cword("0123456789"))班',
      createTime:'@datetime',
      key: '@increment()',
      account:'@id',
      password:'@string(6)',
      stuAddress:'@province@city@country'
    } 
  ]
});

Mock.mock('/get/data','get',() =>{
  return {
    code: 0,
    message:'success',
    data: studentdata
  }
})


export default [
  {
    url:'\/api\/getStudentData',
    method:'get',
    response: () => {
      return {
        code: 0,
        message:'成功获取Mock数据',
        data: studentdata
      }
    }
  },

] as MockMethod[];