import { Select, Table } from "antd"
import {
  DeleteOutlined,
  EditOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from "react"
import useHome from "./useHome"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Instrument = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [idInstrumentEdit, setIdInstrumentEdit] = useState('')
  const [instrumentEdit, setInstrumentEdit] = useState('')
  const [categoryIdEdit, setCategoryIdEdit] = useState('')
  const [categoryEdit, setCategoryEdit] = useState('')
  const [instrumentId, setInstrumentDelete] = useState('')
  const [showDeleteConfirmation, setShowDeleteConfirm] = useState(false)
  const [isEditQuestion, setIsEditQuestion] = useState(false)
  const [instrumentQuestionId, setInstrumentQuestionId] = useState('')

  const {
    state: {
      instrument,
      category,
    },
    methods: {
      handleGetInstrument,
      handleGetCategories,
      handleUpdateInstrument,
      handleDeleteInstrument,
    }
  } = useHome()

  useEffect(() => {
    handleGetInstrument()
  }, [])

  useEffect(() => {
    if (isEdit) handleGetCategories()
  }, [isEdit])

  const handleDelete = async () => {
    await handleDeleteInstrument(+instrumentId)

    setIdInstrumentEdit('')
    setInstrumentEdit('')
    setCategoryIdEdit('')
    setCategoryEdit('')
    setInstrumentDelete('')
    setShowDeleteConfirm(false)
  }

  const handleSubmit = async () => {
    const find: any = category.find((e: any) => e.id == categoryIdEdit)
    await handleUpdateInstrument(idInstrumentEdit, instrumentEdit, categoryIdEdit, find?.categoryName)

    setIsEdit(false)
    setInstrumentEdit('')
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
      title: 'Daftar Instrument',
      dataIndex: 'instrumentName',
      key: 'instrumentName',
    },
    {
      title: 'Kriteria',
      dataIndex: 'instrumentCategoryId',
      key: 'instrumentCategoryId',
    },
    {
      title: 'Jumlah Pertanyaan',
      dataIndex: 'questions',
      key: 'questions',
      render: (_: any, data: any) => {
        return <div
          className="cursor-pointer"
          onClick={() => {
            setIsEditQuestion(true)
            setInstrumentQuestionId(data.id)
          }}
        >
          {data.questions}
        </div>
      }
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
              setIsEdit(true)
              setInstrumentEdit(data.instrumentName)
              setCategoryIdEdit(data.instrumentCategoryId)
              setIdInstrumentEdit(data.id)
            }}
          >
            <EditOutlined />
          </span>
          <span
            style={{ cursor: 'pointer', color: 'red' }}
            onClick={() => {
              setInstrumentDelete(data.id)
              setInstrumentEdit(data.instrumentName)
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
        <div className="text-xl mb-2"><b>Edit Instrument</b></div>
      </div>
      <div className="w-full flex justify-between mb-2">
        <span className="cursor-pointer" onClick={() => setIsEdit(false)}><ArrowLeftOutlined /></span>
      </div>
      <div className="flex flex-col p-5 gap-3 bg-[#D9D9D9] rounded" style={{ maxWidth: '40vw' }}>
        <form className="flex flex-col gap-3 w-full" autoComplete="asdasdsa">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Nama Instrument</label>
            <input
              onInput={(e: any) => setInstrumentEdit(e.target.value)}
              placeholder="Instrument"
              value={instrumentEdit}
              className="w-full p-1 border rounded"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="option">Kriteria</label>
            <Select value={categoryIdEdit} onChange={(e: any) => setCategoryIdEdit(e)}>
              {category.map((e: any) => {
                return <Select.Option value={e.id} key={e.id}>{e.categoryName}</Select.Option>
              })}
            </Select>
          </div>
          <input type="submit" hidden />
        </form>

        <div className="flex justify-end gap-2">
          <div
            className="flex justify-center p-2 w-[120px] rounded cursor-pointer bg-[#b4b4b4] hover:bg-[#DEDEDE]"
            onClick={() => {
              setIsEdit(false)
              setInstrumentEdit('')
              setCategoryIdEdit('')
              setCategoryEdit('')
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

  if (isEditQuestion) {
    return <div className="flex flex-col gap-1">
      <div className="w-full flex justify-between mb-2">
        <div className="text-xl mb-2"><b>Edit Question</b></div>
      </div>
      <div className="w-full flex justify-between mb-2">
        <span className="cursor-pointer" onClick={() => setIsEditQuestion(false)}><ArrowLeftOutlined /></span>
      </div>
      <div className="flex flex-col p-5 gap-3 bg-[#D9D9D9] rounded" style={{ maxWidth: '40vw' }}>
        <form className="flex flex-col gap-3 w-full" autoComplete="asdasdsa">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Nama Instrument</label>
            <input
              onInput={(e: any) => setInstrumentEdit(e.target.value)}
              placeholder="Instrument"
              value={instrumentEdit}
              className="w-full p-1 border rounded"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="option">Kriteria</label>
            <Select value={categoryIdEdit} onChange={(e: any) => setIsEditQuestion(e)}>
              {category.map((e: any) => {
                return <Select.Option value={e.id} key={e.id}>{e.categoryName}</Select.Option>
              })}
            </Select>
          </div>
          <input type="submit" hidden />
        </form>

        <div className="flex justify-end gap-2">
          <div
            className="flex justify-center p-2 w-[120px] rounded cursor-pointer bg-[#b4b4b4] hover:bg-[#DEDEDE]"
            onClick={() => {
              setIsEditQuestion(false)
              setInstrumentEdit('')
              setCategoryIdEdit('')
              setCategoryEdit('')
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
      <div className="text-xl mb-2"><b>Kelola Instrument</b></div>
    </div>
    <Table
      dataSource={instrument}
      columns={column}
    />

    <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirm(!showDeleteConfirmation)} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Konfirmasi</Modal.Title>
      </Modal.Header>
      <Modal.Body>Apakah yakin ingin menghapus {instrumentEdit}?</Modal.Body>
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