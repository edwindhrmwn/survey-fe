import * as XLSX from 'xlsx-js-style'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ProgressBar } from "react-bootstrap";
import { Key, useEffect, useState } from "react"
import { Form, Input, Table, TableColumnsType } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, PrinterOutlined } from "@ant-design/icons"

import useHome from "./useHome"
// @ts-ignore
import { storage } from "../../../firebase"
// @ts-ignore
import { ExcelfitToColumn } from "../../utils"
import dayjs from 'dayjs';


const AdminDashboard = () => {
  const {
    state: {
      categoryCriteria,
      responden,
      questions,
      basedQuestions,
      printData,
    },
    methods: {
      setQuestion,
      handleSubmitAnswer,
      handleDeleteUserAnswer,
      handleGetUserByInstrument,
      handleGetQuestionByInstrument,
      handleGetCategoryCriteriaAdmin,
    }
  } = useHome()

  const [openQuestion, setOpenQuestion] = useState(false)
  const [showSuccess, setSuccess] = useState(false)
  const [openRespondenInstrument, setOpenRespondenInstrument] = useState(false)
  const [activeUser, setActiveUser] = useState(0)
  const [username, setActiveUserName] = useState('')
  const [instrumentId, setInstrumentId] = useState(0)
  const [instrumentName, setInstrumentName] = useState('')
  const [criteriaName, setCriteriaName] = useState('')
  const [showDeleteConfirmation, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    handleGetCategoryCriteriaAdmin()
  }, [])

  const handleCloseQuestion = () => {
    setOpenQuestion(false)
  }

  const handleDetailReponden = async (id: number, criteriaName: string, name: string) => {
    setOpenRespondenInstrument(true)
    setInstrumentId(id)
    setCriteriaName(criteriaName)
    setInstrumentName(name)
    await handleGetUserByInstrument(id)
  }

  const handlOnChange = (data: any, answer: any, additionalAnswer?: any) => {
    const rs: any = []
    for (const question of questions) {
      const detail: any = question
      if (detail?.id == data.id) {
        rs.push({
          ...detail,
          questionId: detail.id,
          userId: activeUser,
          answer: answer,
          additionalAnswer,
          instrumentId: detail.instrumentId,
        })
      } else {
        rs.push({
          ...detail,
          questionId: detail.id,
          userId: activeUser,
          instrumentId: detail.instrumentId,
        })
      }
    }

    setQuestion(rs)
  }

  const handleSubmit = async () => {
    const data = questions.map((v: any) => ({ ...v, userId: activeUser }))

    await handleSubmitAnswer(data)
    await handleGetUserByInstrument(instrumentId)
    setOpenQuestion(!openQuestion)
    handleGetCategoryCriteriaAdmin()
    setSuccess(true)
    setActiveUser(0)

    setTimeout(() => {
      setSuccess(false)
    }, 2000);
  }

  const handleUploadFile = async (data: any, file: any) => {
    const imageRef = ref(storage, `files/${Math.random().toString()}-${file.name}`)
    const firebaseData = await uploadBytes(imageRef, file)
    const url = await getDownloadURL(firebaseData.ref)
    handlOnChange(data, url)
  }

  const renderQuestion = (type: string, data: any, isDisable: boolean, idx: number) => {
    switch (type) {
      case 'upload':
        if (data.answer) {
          return <div>
            Berkas
            <div className="flex flex-col">
              <a href={data.answer} target="_blank">Berkas Terikirm</a>
              <div className="input-group mb-3">
                {/* @ts-ignore */}
                <input type="file" disabled={isDisable} className="form-control" id="inputGroupFile02" onChange={(e) => handleUploadFile(data, e.target.files[0])} />
                <label className="input-group-text" htmlFor="inputGroupFile02">Perbaharui Berkas</label>
              </div>
            </div>
          </div>
        }

        return (
          <div>
            Berkas
            <div className="input-group mb-3">
              {/* @ts-ignore */}
              <input type="file" disabled={isDisable} className="form-control" id="inputGroupFile02" onChange={(e) => handleUploadFile(data, e.target.files[0])} />
              <label className="input-group-text" htmlFor="inputGroupFile02">{isDisable ? 'Berkas Terikirm' : 'Kirim Berkas'}</label>
            </div>
          </div>
        )
      case 'essay':
        return (
          <div>
            <span>{data.question}</span>
            <Input value={data?.answer || ''} disabled={isDisable} onChange={(e) => handlOnChange(data, e.target.value)} />
          </div>
        )
      case 'options':
        return (
          <>
            {idx == 0 &&
              <div className="flex justify-between border-b-2">
                <span className="flex flex-wrap" style={{ width: 150 }}>Jenis Kemampuan</span>
                <>
                  <div className="flex flex-col">
                    Sangat Baik
                  </div>
                  <div className="flex flex-col">
                    Baik
                  </div>
                  <div className="flex flex-col">
                    Cukup
                  </div>
                  <div className="flex flex-col">
                    Kurang
                  </div>
                </>
                <div style={{ width: 200 }}>
                  Rencana Tindak Lanjut oleh UPPS/PS
                </div>
              </div>
            }
            <div className="flex justify-between">
              <span className="flex flex-wrap" style={{ width: 150 }}>{data.question}</span>
              <>
                <div className="flex flex-col">
                  <Input value={"Sangat Baik"} disabled={isDisable} checked={data.answer == "Sangat Baik"} className="form-check-input" type="radio" onChange={(e) => handlOnChange(data, e.target.value, data.additionalAnswer)} />
                </div>
                <div className="flex flex-col">
                  <Input value={"Baik"} disabled={isDisable} checked={data.answer == "Baik"} className="form-check-input" type="radio" onChange={(e) => handlOnChange(data, e.target.value, data.additionalAnswer)} />
                </div>
                <div className="flex flex-col">
                  <Input value={"Cukup"} disabled={isDisable} checked={data.answer == "Cukup"} className="form-check-input" type="radio" onChange={(e) => handlOnChange(data, e.target.value, data.additionalAnswer)} />
                </div>
                <div className="flex flex-col">
                  <Input value={"Kurang"} disabled={isDisable} checked={data.answer == "Kurang"} className="form-check-input" type="radio" onChange={(e) => handlOnChange(data, e.target.value, data.additionalAnswer)} />
                </div>
              </>
              <Input
                value={data.additionalAnswer}
                disabled={isDisable}
                onChange={(e) => handlOnChange(data, data.answer, e.target.value)}
                style={{ width: 200 }}
              />
            </div>
          </>
        )
      case 'lov academic year':
        return (
          <div className="flex flex-col w-full">
            <div>{data.question}</div>
            <select disabled={isDisable} value={data.answer} onChange={(e) => handlOnChange(data, e.target.value)}>
              <option value={"TS-1"}>TS-1</option>
              <option value={"TS-2"}>TS-2</option>
              <option value={"TS-3"}>TS-3</option>
              <option value={"TS-4"}>TS-4</option>
            </select>
          </div>
        )
      case 'lov tahun lulus': // TS-2, TS-1, TS
        return (
          <div className="flex flex-col w-full">
            <div>{data.question}</div>
            <select disabled={isDisable} value={data.answer} onChange={(e) => handlOnChange(data, e.target.value)}>
              <option value={"TS-2"}>TS-2</option>
              <option value={"TS-1"}>TS-1</option>
              <option value={"TS"}>TS</option>
            </select>
          </div>
        )
      case 'lov tahun lulus 2': // TS-4, TS-3, TS-2
        return (
          <div className="flex flex-col w-full">
            <div>{data.question}</div>
            <select disabled={isDisable} value={data.answer} onChange={(e) => handlOnChange(data, e.target.value)}>
              <option value={"TS-4"}>TS-4</option>
              <option value={"TS-3"}>TS-3</option>
              <option value={"TS-2"}>TS-2</option>
            </select>
          </div>
        )
      case 'lov tahun masuk': // TS-6. TS-5, TS-4, TS-3
        return (
          <div className="flex flex-col w-full">
            <div>{data.question}</div>
            <select disabled={isDisable} value={data.answer} onChange={(e) => handlOnChange(data, e.target.value)}>
              <option value={"TS-6"}>TS-6</option>
              <option value={"TS-5"}>TS-5</option>
              <option value={"TS-4"}>TS-4</option>
              <option value={"TS-3"}>TS-3</option>
            </select>
          </div>
        )
      case 'lov academic role':
        return (
          <div className="flex flex-col w-full">
            <span>{data.question}</span>
            <select disabled={isDisable} value={data.answer} onChange={(e) => handlOnChange(data, e.target.value)}>
              <option value={"Pustakawan"}>Pustakawan</option>
              <option value={"Laboran"}>Laboran/ Teknisi</option>
              <option value={"Administrasi"}>Administrasi</option>
              <option value={"Lainnya"}>Lainnya</option>
            </select>
          </div>
        )
      case 'lov source income':
        return (
          <div className="flex flex-col w-full">
            <span>{data.question}</span>
            <select disabled={isDisable} value={data.answer} onChange={(e) => handlOnChange(data, e.target.value)}>
              <option value={"Dana dari SPP Mahasiswa"}>Dana dari SPP Mahasiswa</option>
              <option value={"Dana dari Yayasan"}>Dana dari Yayasan</option>
              <option value={"Dana dari luar SPP, non Yayasan"}>Dana dari luar SPP, non Yayasan</option>
            </select>
          </div>
        )
      default:
        break;
    }
  }

  const handleDelete = async () => {
    await handleDeleteUserAnswer(activeUser, instrumentId)
    setActiveUser(0)
    setShowDeleteConfirm(false)
  }

  const exportCSV = async (id: number | null) => {
    const firstRow = [{ v: criteriaName }]
    const secondRow = [{ v: instrumentName }]
    const thirdRow = [{ v: '' }]

    const header: any[] = [{ v: 'No' }, { v: 'Pertanyaan' }]
    const body: any[] = []

    for (const e of printData.users) {
      const detail: any = e
      
      if (id) {
        if (detail.id == id) {
          header.push({ v: detail.username })
        }

        continue
      }
      header.push({ v: detail.username })
    }

    for (let i = 0; i < printData.questions.length; i++) {
      const o = printData.questions[i];

      const row = [{ v: i + 1 }, { v: o.question }]
      if (id) {
        const find = printData.answers.find((e: any) => e.userId == id && e.questionId == o.id)
        row.push({ v: !!find ? find.answer : '' })
      } else {
        for (const user of printData.users) {
          const find = printData.answers.find((e: any) => e.userId == user.id && e.questionId == o.id)
          row.push({ v: !!find ? find.answer : '' })
        }
      }

      body.push(row)
    }
    const data = [firstRow, secondRow, thirdRow, header, ...body]

    const workBook = XLSX.utils.book_new(); // create a new blank book
    const workSheet = XLSX.utils.aoa_to_sheet(data, {});

    let fileName = `REPORT RESPONDEN ${instrumentName}-${dayjs(new Date()).format("DD-MM-YYYY")}.xlsx`

    if (id) {
      fileName = `REPORT RESPONDEN ${username} - ${instrumentName}-${dayjs(new Date()).format("DD-MM-YYYY")}.xlsx`
    }

    // ! Auto
    workSheet['!cols'] = ExcelfitToColumn(data, true);
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1")
    XLSX.writeFile(
      workBook,
      fileName
    );
  }

  if (openRespondenInstrument) {
    const columns: TableColumnsType<any> | undefined = [
      {
        title: 'Daftar User',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: 'Terjawab',
        dataIndex: 'answers',
        key: 'answers',
      },
      {
        title: 'Progress',
        dataIndex: 'answers',
        key: 'answers',
        render: (_: any, data: any) => {
          if (+data.questions == 0) return null

          const now = Math.round(+data.answers / +data.questions * 100)
          return <ProgressBar now={now} label={`${now}%`} />
        }
      },
      {
        title: 'aksi',
        dataIndex: 'username',
        key: 'username',
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
                setOpenQuestion(true)
                handleGetQuestionByInstrument(instrumentId, data.userId)
                setActiveUser(data.userId)
              }}
            >
              <EditOutlined />
            </span>
            <span
              style={{ cursor: 'pointer', color: 'red' }}
              onClick={() => {
                setActiveUser(data.userId)
                setActiveUserName(data.username)
                setShowDeleteConfirm(true)
              }}
            >
              <DeleteOutlined />
            </span>
            <span
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={() => {
                exportCSV(data.userId)
                setActiveUser(data.userId)
                setActiveUserName(data.username)
              }}
            >
              <PrinterOutlined />
            </span>
          </div>
        }
      },
    ]

    return (
      <div className="flex flex-col gap-1">

        <div className="w-full flex justify-between mb-2">
          <div className="text-xl mb-2"><b>List Respon</b></div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex mb-2 gap-5">
            <span className="cursor-pointer" onClick={() => setOpenRespondenInstrument(false)}><ArrowLeftOutlined /></span>
            <b>{instrumentName}</b>
          </div>

          <div
            className="flex gap-1 p-2 rounded cursor-pointer bg-[#0C6DFD] hover:bg-[#2b60ae]"
            style={{ color: 'white' }}
            onClick={() => exportCSV(null)}
          >
            <PrinterOutlined style={{ width: 40 }} className="flex items-center" />
            <div className="flex w-full">Export to Excel</div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={responden}
        />

        <Modal show={openQuestion} onHide={handleCloseQuestion}>
          <Modal.Header closeButton>
            <div>
              <Modal.Title>{instrumentName}</Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Form className="flex flex-col gap-3">
              {questions.length ?
                questions.map((e: any, i: Key) => {
                  return renderQuestion(e.questionType, e, false, +i)
                }) : null
              }
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseQuestion}>
              Tutup
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={JSON.stringify(basedQuestions) == JSON.stringify(questions)}>
              Simpan
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirm(!showDeleteConfirmation)} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Konfirmasi</Modal.Title>
          </Modal.Header>
          <Modal.Body>Apakah yakin ingin menghapus jawaban dari {username}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(!showDeleteConfirmation)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleDelete}>
              Hapus
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showSuccess} onHide={() => setSuccess(false)}>
          <Modal.Body className="bg-[#77e977ee] text-green-900 rounded-xl">
            Success Submit
          </Modal.Body>
        </Modal>
      </div>
    )
  }

  return (
    <>
      <div className="w-full flex justify-between mb-2">
        <div className="text-xl mb-2"><b>Survey Dashbord</b></div>
      </div>
      <div className="flex flex-col gap-5">
        {categoryCriteria.map((e: any, i: Key) => {
          return <div key={i}>
            <div className="w-100 mb-2">
              <div className="card border-left-primary shadow py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="fs-3 font-weight-bold text-primary text-uppercase">
                        Kriteria {+i + 1} - {e.categoryName}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {e.criteria.map((detail: any, idx: Key) => {
                return <div className="card shadow col-6 col-sm-3" key={idx}>
                  <div className="card-header">
                    <h6 className="m-0 font-weight-bold text-primary">Tabel {+i + 1}{e.criteria.length > 1 ? `.${+idx + 1}` : ''}</h6>
                  </div>
                  <div className="card-body mt-2 text-dark">
                    <h6>{detail.instrumentName}</h6>
                    <a
                      data-toggle="modal"
                      data-target="#tabel1Modal"
                      className="btn btn-primary btn-icon-split"
                      onClick={() => handleDetailReponden(detail.id, `Kriteria ${+i + 1} - ${e.categoryName}`, detail.instrumentName)}
                      style={{
                        backgroundColor: detail.questions > 0 && !!detail.isCompleted ? '#C5D3E0' : '#0C6DFD',
                        color: detail.questions > 0 && !!detail.isCompleted ? 'black' : 'white',
                      }}
                    >
                      <span className="text">{detail.responden == "" ? "" : detail.responden} Responden</span>
                    </a>
                  </div>
                </div>
              })}
            </div>
          </div>
        })}
        <Modal show={showSuccess} onHide={() => setSuccess(false)}>
          <Modal.Body className="bg-[#77e977ee] text-green-900 rounded-xl">
            Success Submit
          </Modal.Body>
        </Modal>
      </div>
    </>
  )
}

export default AdminDashboard