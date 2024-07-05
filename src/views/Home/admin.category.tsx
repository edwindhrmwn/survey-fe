import { Select, Table, TableColumnsType } from "antd"
import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  DeleteOutlined,
  HomeOutlined,
  CheckSquareOutlined,
  EditOutlined,
  BackwardOutlined,
  ArrowsAltOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { Key, useEffect, useState } from "react"
import useHome from "./useHome"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const Instrument = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [categoryEdit, setCategoryEdit] = useState('')
  const [categoryCodeEdit, setCategoryCodeEdit] = useState('')
  const [categoryIdEdit, setCategoryIdEdit] = useState('')
  const [showDeleteConfirmation, setShowDeleteConfirm] = useState(false)

  const {
    state: {
      category,
    },
    methods: {
      handleGetCategories,
      handleUpdateCategory,
      handleDeleteCategory,
    }
  } = useHome()

  useEffect(() => {
    handleGetCategories()
  }, [])

  const handleDelete = async () => {
    await handleDeleteCategory(+categoryIdEdit)

    setCategoryEdit('')
    setCategoryIdEdit('')
    setShowDeleteConfirm(false)
  }

  const handleSubmit = async () => {
    await handleUpdateCategory(+categoryIdEdit, categoryEdit, categoryCodeEdit)

    setIsEdit(false)
    setCategoryEdit('')
    setCategoryIdEdit('')
    setCategoryEdit('')
  }


  const column = [
    {
      title: 'No',
      render: (_: any, data: any, idx: any) => {
        return idx + 1
      }
    },
    {
      title: 'Daftar Kriteria',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Kode Kriteria',
      dataIndex: 'categoryCode',
      key: 'categoryCode',
    },
    {
      title: 'Aksi',
      dataIndex: '',
      key: '',
      render: (data: any) => {
        return <div className="flex gap-4">
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => {
              console.log(data)
              setIsEdit(true)
              setCategoryEdit(data.categoryName)
              setCategoryCodeEdit(data.categoryCode)
              setCategoryIdEdit(data.id)
            }}
          >
            <EditOutlined />
          </span>
          <span
            style={{ cursor: 'pointer', color: 'red' }}
            onClick={() => {
              setCategoryIdEdit(data.id)
              setCategoryEdit(data.categoryName)
              setCategoryCodeEdit(data.categoryCode)
              setShowDeleteConfirm(true)
            }}
          >
            <DeleteOutlined />
          </span>
        </div>
      }
    },
  ]

  if (isEdit) {
    return <div className="flex flex-col gap-1">
      <div className="w-full flex justify-between mb-2">
        <div className="text-xl mb-2"><b>Edit Kriteria</b></div>
      </div>
      <div className="w-full flex justify-between mb-2">
        <span className="cursor-pointer" onClick={() => setIsEdit(false)}><ArrowLeftOutlined /></span>
      </div>
      <div className="flex flex-col p-5 gap-3 bg-[#D9D9D9] rounded" style={{ maxWidth: '40vw' }}>
        <form className="flex flex-col gap-3 w-full" autoComplete="asdasdsa">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Nama Kriteria</label>
            <input
              onInput={(e: any) => setCategoryEdit(e.target.value)}
              placeholder="Kriteria"
              value={categoryEdit}
              className="w-full p-1 border rounded"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="option">Kriteria</label>
            <input
              onInput={(e: any) => setCategoryCodeEdit(e.target.value)}
              placeholder="Kode Kriteria"
              value={categoryCodeEdit}
              className="w-full p-1 border rounded"
            />
          </div>
          <input type="submit" hidden />
        </form>

        <div className="flex justify-end gap-2">
          <div
            className="flex justify-center p-2 w-[120px] rounded cursor-pointer bg-[#b4b4b4] hover:bg-[#DEDEDE]"
            onClick={() => {
              setIsEdit(false)
              setCategoryEdit('')
              setCategoryIdEdit('')
              setCategoryCodeEdit('')
            }}
          >
            Batal
          </div>
          <div
            className="flex justify-center p-2 w-[120px] rounded cursor-pointer bg-[#b4b4b4] hover:bg-[#DEDEDE]"
            onClick={handleSubmit}
          >
            Simpan
          </div>

        </div>
      </div>
    </div>
  }

  return <>
    <div className="w-full flex justify-between mb-2">
      <div className="text-xl mb-2"><b>Kelola Kriteria</b></div>
    </div>
    <Table
      dataSource={category}
      columns={column}
    />

    <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirm(!showDeleteConfirmation)} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Konfirmasi</Modal.Title>
      </Modal.Header>
      <Modal.Body>Apakah yakin ingin menghapus {categoryEdit}?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteConfirm(!showDeleteConfirmation)}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleDelete}>
          Hapus
        </Button>
      </Modal.Footer>
    </Modal>
  </>
}

export default Instrument