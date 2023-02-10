import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import 
{ 
  Layout, 
  Modal, 
  Space, 
  Button, 
  Input, 
  Table, 
  Radio, 
  Col, 
  Row, 
  Descriptions, 
  Select, 
  Form 
} from 'antd';
import axios from 'axios';
const { Header, Footer, Content } = Layout;
const { Column } = Table;
import Mock from 'mockjs';

function App() {  
  return (
      <StudentListWebView />
  );
};



function StudentListWebView() {
  const [stulist, setStulist ] = useState(studentdata.studentdata);
  const [option, setOption] = useState([{value:'',label:''}]);
  const [filter, setFilter] = useState({});

  /*初始化搜索栏学校选项*/
  useEffect( () => {
    setOption([
      {value:'福州一中',label:'福州一中'},
      {value:'福州二中',label:'福州二中'},
      {value:'福州三中',label:'福州三中'},
      {value:'福州四中',label:'福州四中'},
      {value:'福州五中',label:'福州五中'},
      {value:'福州六中',label:'福州六中'},
      {value:'福州七中',label:'福州七中'},
      {value:'福州八中',label:'福州八中'},
      {value:'福州九中',label:'福州九中'},
    ]);
  },[option.values]);

  /*删除学生数据*/ 
  const deleteStudentList = (index:number) => {
    setStulist( () => {
      /* 使用深拷贝防止渲染两次*/
      let state = JSON.parse(JSON.stringify(stulist))
      state.splice(index,1);
      return[...state]
    })
  }

  /*创建新的学生数据*/ 
  const createStudentList = ( values: StudentInfo| null ) => {
    setStulist( () => {
      let state = JSON.parse(JSON.stringify(stulist))
      state.push(values)
      return [...state]
    })
  }

  /* 编辑学生数据 */
  const editStudnetList = (index: number,newState: StudentInfo) => {
    setStulist( () =>{
      let state = JSON.parse(JSON.stringify(stulist))
      state[index] = Object.assign(state[index],newState);
      return [...state];
    })
  }

  return (
    <Layout>
      <Header style={{ backgroundColor: 'white',marginBottom:'25px'}}>
        学生管理列表
      </Header>
      <Content style={{padding:'0 50px',  }}>
        <Space direction='vertical' size="middle" style={{ display:'flex' }} >
           <StudentListSearch 
           data={stulist}
           option={option}
           setFilter={ (values: any) => setFilter(values)  } 
           />
           <StudentListContainer 
           delete={deleteStudentList}
           create={createStudentList}
           data={stulist} 
           edit={editStudnetList}
           filter={filter}
           />
        </Space>
      </Content>
      <Footer style={{ textAlign: 'center'}}>音乐考试管理平台</Footer>
    </Layout>
  );
}; 

/*搜索栏组件*/ 
function StudentListSearch (props :any) { 
  const [isDisabled, setIsDisabled] = useState(false);
  const [form] = Form.useForm();

  /*获取搜索栏中选择的数据*/ 
  const onFinish = (values : any) => {
    props.setFilter(values)
  }

  /*清除已填写的内容*/ 
  const resetStudentSearchFilter = () => {
      form.resetFields();
      props.setFilter({name:'undefined',account:'undefined',school:'undefined'})
  };
  /*切换是否启用搜索*/ 
  const disableSearch = () => {
    setIsDisabled(!isDisabled);
  }

  return (
    <>
      <Form onFinish={onFinish} form={form} style={{marginBottom:'5px',padding:'0 25px'}}>
        <Space 
        style={{ 
          display:'flex',
          padding:'25px 25px 0px 25px',
          backgroundColor:'white',
        }}
        size={'large'}
        >
          <Form.Item name={'name'} label={'学生姓名:'}>
            <Input disabled={isDisabled} placeholder="填写学生姓名" />
          </Form.Item>
          <Form.Item name={'account'} label={'学生账号:'}
          >
            <Input disabled={isDisabled} placeholder="填写学生账号"/>
          </Form.Item>
          <Form.Item  name={'school'} label={'所属学校:'} >
            <Select
              disabled={isDisabled}
              placeholder="选择学校"
              options={props.option} 
          />
          </Form.Item>
          <Form.Item label={'是否启用:'} >
            <Radio.Group onChange={()=>disableSearch()} defaultValue={"on"} >
              <Radio.Button value={"on"}  style={{border:'0'}}>启用</Radio.Button>
              <Radio.Button value={"off"} style={{border:'0'}}>禁用</Radio.Button>
            </Radio.Group>
          </Form.Item> 
          <Form.Item>
            <Button htmlType={'submit'}  >查询</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={ ()=>resetStudentSearchFilter() }>重置</Button>
          </Form.Item>
        </Space>  
      </Form>
    </>

  );
};

/*学生数据列表组件*/ 
function StudentListContainer (props :any)  {
 
  const [openModal,setOpenModal] = useState(false);
  const [modalTitle,setModalTitle] = useState('');
  const [currentRow, setCurrentROw] = useState({});
  const [getkey, setGetkey] = useState(0);
  const [deleteModal, setdeleteModal] = useState(false);

  /*设置key值*/
  const setkey = ():number  => {
    let key = props.data.length+1;
    setGetkey(key);
    return key;
  }
  
  /*关闭弹出窗口*/  
  const closeModal = () => {
    setOpenModal(false);
  }

  /*打开创建学生窗口*/ 
  const createStudentList = () => {
    setModalTitle('创建学生');
    setOpenModal(true);
  }

  /*打开编辑学生窗口,传递当前行数据*/ 
  const editStudentList = (row: any) => {
    setCurrentROw(row);
    setModalTitle('编辑学生');
    setOpenModal(true);
  }

  /*删除当前行*/ 
  const deleteStudentList = (row: any) => {
    setdeleteModal(true);
    setCurrentROw(row);
  }

  /*打开详情窗口 */ 
  const showStudentDetail = (row: any) => {
    setCurrentROw(row);
    setModalTitle('');
    setOpenModal(true);
  }
 
  return (
    <>
      <StudentModal 
        open={openModal} 
        title={modalTitle} 
        close={closeModal}
        data={currentRow}
        create={props.create}
        edit={props.edit}
        setkey={setkey}
      />
      <Button
        style={{float:'right', margin:'10px 25px 10px 0'}} 
        onClick={ () => createStudentList() }>{"创建学生"}
      </Button>
      <Table dataSource={props.data} style={{padding:'0 20px'}}>
        <Column title="学生姓名" dataIndex="name" key="name" 
          filteredValue={[props.filter.name]}
          onFilter={ (value: string | number | boolean, record) => { 
            return  (record as any).name.indexOf(value) === 0 || value=='undefined' ;
         }}
         />
        <Column title="学号" dataIndex="stuId" key="stuId" />
        <Column title="所属学校" dataIndex="school" key="school" 
          filteredValue={[props.filter.school]}
          onFilter={ (value, record) => {
            return (record as any).school.indexOf(value) === 0 || value=='undefined';
          }}
        />
        <Column title="所在班级" dataIndex="stuClass" key="stuClass" />
        <Column title="创建时间" dataIndex="createTime" key="createTime" />
        <Column 
          key="action" 
          render={(record) => (
            <Space size="middle">
              <a onClick={ ()=>editStudentList(record) }>编辑</a>
              <a onClick={ ()=>deleteStudentList(record) }>删除</a>
              <a onClick={ ()=>showStudentDetail(record) }>详情</a>
            </Space>
          )}
        />
        <Column 
          filteredValue={[props.filter.account]}
          onFilter={ (value, record) => {
            return (record as any).account.indexOf(value) === 0 || value=='undefined';
          }}
        />
      </Table>
      
      <Modal
        open={deleteModal}
        okText='删除'
        cancelText='取消'
        onOk={() => {
          let index = props.data.indexOf(currentRow)
          if(props.data.length>1){
            props.delete(index);
          }
          setdeleteModal(false)
        }}
        onCancel={() => [setdeleteModal(false)]}
      >
        确认删除学生数据吗?
      </Modal>
    </>
  );
};


/*窗口组件*/ 
function StudentModal (props: any) {
  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const editformRef = useRef(null);
  const createformRef = useRef(null);
  
  /*初始化编辑学生的原始数据*/ 
  useEffect(()=> {
    let FieldValues = {
      editname: props.data.name,
      editstuId: props.data.stuId,
      editpassword: props.data.password,
      editaccount: props.data.account,
      editschool: props.data.school,
      editstuClass: props.data.stuClass,
      editstuAddress: props.data.stuAddress,
      editphone: props.data.phone
    }
    if(props.title=='编辑学生'){
      editForm.setFieldsValue(FieldValues);
    }
      
  },[props.open])

  /*获得当前时间*/ 
  const currentTime =  (): string => {
    let now = new Date;
    let time = {
      year: now.getFullYear(),
      month:  now.getMonth(),
      date: now.getDate(),
      hours: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds(),
      getFormatTime() {
        return (
          this.year + '-' + timeFormat(this.month) + '-' + timeFormat(this.date) + ' ' +
          timeFormat(this.hours) + ':' +timeFormat(this.minute) + ':' + timeFormat(this.second)
        );
      }
    }
    const timeFormat = (time: any) => {
      if(time<10){
        return '0' + time;
      } else {
        return '' + time;
      }
    }
    return time.getFormatTime();
  }

  /*创建新学生信息*/
  const createStudent = (values: any) => {
    let newStudent: StudentInfo = values;
    newStudent.createTime = currentTime();
    newStudent.key = props.setkey();
    props.create(newStudent);
    props.close();
  }

  /*编辑学生信息*/
  const editStudent = (values: any) => {
    /*使用edit窗口获得的values进行赋值*/
    let newValues : StudentInfo = {
      name: values.editname,
      stuId: values.editstuId,
      password: values.editpassword,
      account: values.editaccount,
      school: values.editschool,
      stuClass: values.editstuClass,
      stuAddress: values.editstuAddress,
      phone: values.editphone
    }
    let index = props.data.key-1;
    props.edit(index,newValues);
    editForm.setFieldsValue(values);
    props.close();
  }

  /*控制窗口打开类型*/
  if(props.title){
    if(props.title == '编辑学生'){
      return(
        <>
        {/*学生编辑窗口*/}
          <Modal 
            title={props.title}
            open={props.open} 
            onOk={ () =>{
              editForm
                .validateFields()
                .then( (values) => {
                  editStudent(values);
                })
            }} 
            onCancel={ props.close}
            okText = { "修改学生信息" }
            cancelText = {"取消"}
            getContainer = {false}
          >
            <Form form={editForm}  ref={editformRef}>
              <Space direction='vertical' size="middle" style={{ display:'flex' }}>
                <Row>
                  <Col span={10}>
                    <Form.Item
                      label="学生姓名"
                      name={"editname"}
                    >                    
                    <Input  />
                    </Form.Item>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={10}>
                    <Form.Item
                        label="学生学号"
                        name={"editstuId"}
                    > 
                      {/*如果是编辑学生窗口则禁止编辑学号*/}
                      <Input disabled={true}/>
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      label="学生密码"
                      name={"editpassword"}
                    >                    
                    <Input  />
                    </Form.Item>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={10}>
                    <Form.Item
                        label="学生账号"
                        name={"editaccount"}
                    >    
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      label="所属学校"
                      name={"editschool"}
                    >                    
                    <Input  />
                    </Form.Item>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={10}>
                    <Form.Item
                        label="所属班级"
                        name={"editstuClass"}
                    >    
                      <Input  />
                    </Form.Item>
                  </Col>
                  <Col span={22}>
                    <Form.Item
                        label="家庭住址"
                        name={"editstuAddress"}
                    >    
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                        label="联系方式"
                        name={"editphone"}
                    >    
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Space>
            </Form>
          </Modal>
      </>
      );
    } else {

      return(
        <>
          {/*学生创建窗口*/}
          <Modal 
            title={props.title}
            open={props.open} 
            onOk={ () => {
              createForm
                .validateFields()
                .then((values) => {
                  createStudent(values)
                  createForm.resetFields();
               })
               .catch((info) => {
                console.log('获取失败:',info);
               });
            }} 
            onCancel={ props.close }
            okText = { "创建新学生" }
            afterClose={ () => {
              if(createformRef.current){
                createForm.resetFields()
              }
            }}
            cancelText = {"取消"} 
          >
            <Form form={createForm} ref={createformRef}>
              <Space direction='vertical' size="middle" style={{ display:'flex' }}>
                <Row>
                  <Col span={10}>
                    <Form.Item
                      label="学生姓名"
                      name={"name"}
                      rules={[{required: true, message:'请输入学生姓名'}]}
                    >                    
                    <Input  />
                    </Form.Item>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={10}>
                    <Form.Item
                      label="学生学号"
                      name={"stuId"}
                    > 
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      label="学生账号"
                      name={"account"}
                      rules={[{required: true, message:'请输入学生账号'}]}
                    >    
                      <Input  />
                    </Form.Item>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={10}>
                    <Form.Item
                      label="学生密码"
                      name={"password"}
                    >                    
                    <Input  />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      label="所属学校"
                      name={"school"}
                      rules={[{required: true, message:'请输入所属学校'}]}
                    >                    
                    <Input />
                    </Form.Item>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={10}>
                    <Form.Item
                      label="所属班级"
                      name={"stuClass"}
                    >    
                      <Input  />
                    </Form.Item>
                  </Col>
                  <Col span={22}>
                    <Form.Item
                      label=" 家庭住址 "
                      name={"stuAddress"}
                      style={{marginLeft:'10px'}}
                    >    
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      label="联系方式 "
                      name={"phone"}
                      style={{marginLeft:'10px'}}
                    >    
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Space>
            </Form>
          </Modal>
        </>
      );
    }
  } else {
    return (
      <>
        {/* 学生详情信息窗口 */}  
        <Modal 
          title={props.title}
          open={props.open} 
          onOk={ props.close } 
          onCancel={ props.close }
          okText = { "确认" }
          cancelText = {"取消"} 
        >
          <Descriptions title="学生详情" bordered column={2} > 
              <Descriptions.Item  label="学生姓名" >{props.data.name}</Descriptions.Item>
              <Descriptions.Item  label="学号" >{props.data.stuId}</Descriptions.Item>
              <Descriptions.Item  label="学生账号" >{props.data.account}</Descriptions.Item>
              <Descriptions.Item  label="学生密码" >{props.data.password}</Descriptions.Item>
              <Descriptions.Item  label="所属学校" >{props.data.school}</Descriptions.Item>
              <Descriptions.Item  label="所属班级" >{props.data.stuClass}</Descriptions.Item>
              <Descriptions.Item  label="家庭住址" span={2} >{props.data.stuAddress}</Descriptions.Item>
              <Descriptions.Item  label="联系方式" span={1}>{props.data.phone}</Descriptions.Item>
          </Descriptions> 
        </Modal>
      </>
    );
  }
};


const studentdata = Mock.mock({
  'studentdata|9-13': [
    {
      name:'@cname(3)',
      stuId: '@cword("0123456789",11) ',
      school: '福州@cword("一二三四五六七八九")中',
      stuClass: '@cword("一二三四五六七八九")年级(@cword("0123456789"))班',
      createTime:'@datetime',
      updateTime: '@now',
      key: '@increment()',
      account:'@id',
      password:'@string(6)',
      stuAddress:'@province@city@county',
      phone: '1@cword("35")@cword("0123456789",10)',
    } 
  ]
});

interface StudentInfo {
  name?: string | null, 
  stuId?: string | null,
  account?: string | null,
  password?: string | null,
  school?: string | null,
  stuClass?: string | null,
  phone?:string | null,
  stuAddress?: string | null,
  createTime?: string | null,
  updateTime?: string | null,
  key?: number | null,
};

interface SelectOptionType {
  value: string,
  label: string,
}

export default App;
