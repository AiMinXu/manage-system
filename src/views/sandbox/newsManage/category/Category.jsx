import React, { useEffect, useState, useRef, useContext } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import axios from 'axios';

const { confirm } = Modal
const EditableContext = React.createContext(null);

const Category = () => {

  const [dataSource, setDataSource] = useState()
  const user = JSON.parse(localStorage.getItem("token"))
  const { role: { id } } = user

  useEffect(() => {
    if (id === 1) {
      axios.get("/categories").then(res => {
        console.log(res.data);
        setDataSource(res.data)
      })
    }
  }, [id])

  const confirmHandle = (item) => {
    confirm({
      title: "确定要删除吗？",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteHandle(item);
        // console.log("ok");
      },
      onCancel() {
        // console.log("Cancel");
      }
    });
  }
  const deleteHandle = (item) => {
    setDataSource(dataSource.filter(data => item.id !== data.id))
    axios.delete(`/categories/${item.id}`)
  }
  const handleSave = (record) => {
    // const newData = [...dataSource];
    // const index = newData.findIndex((item) => row.key === item.key);
    // const item = newData[index];
    // newData.splice(index, 1, { ...item, ...row });
    // setDataSource(newData);
    // console.log(row);
    setDataSource(dataSource.map(item => {
      if (item.id === record.id) {
        return {
          id: item.id,
          title: record.title,
          value: record.title,
        }
      }
      return item
    }))
    axios.patch(`/categories/${record.id}`, {
      title: record.title,
      value: record.title,
    })
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id => <b>{id}</b>
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave,
      }),
    },
    {
      title: '操作',
      key: 'opration',
      render: item => {
        return <div>
          <Button danger icon={<DeleteOutlined />} onClick={() => confirmHandle(item)}>删除</Button>
        </div>
      }
    }
  ]

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          }
        }} />
    </div>
  );
};

export default Category;
