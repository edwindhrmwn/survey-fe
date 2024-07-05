import { Key, useEffect, useState } from "react"
import useHome from "./useHome"

// @ts-ignore
import { storage } from "../../../firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Input } from "antd";

const UserDashboard = () => {
  const {
    state: {
      categoryCriteria,
      questions,
    },
    methods: {
      setQuestion,
      handleSubmitAnswer,
      handleGetCategoryCriteria,
      handleGetQuestionByInstrument,
    }
  } = useHome()

  const [openQuestion, setOpenQuestion] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [showSuccess, setSuccess] = useState(false)

  useEffect(() => {
    handleGetCategoryCriteria()
  }, [])

  const handleOpenQuestion = (id: number) => {
    setOpenQuestion(true)
    setActiveQuestion(id)
    handleGetQuestionByInstrument(id)
  }

  const handleCloseQuestion = () => {
    setOpenQuestion(false)
    setActiveQuestion(0)
  }

  const handlOnChange = (data: any, answer: any) => {
    const rs: any = []
    for (const question of questions) {
      const detail: any = question
      if (detail?.id == data.id) {
        rs.push({
          ...detail,
          questionId: detail.id,
          userId: sessionStorage.getItem('userId'),
          answer: answer,
          instrumentId: detail.instrumentId,
        })
      } else {
        rs.push(detail)
      }
    }

    setQuestion(rs)
  }

  const handleSubmit = async () => {
    await handleSubmitAnswer(questions)
    setOpenQuestion(!openQuestion)
    handleGetCategoryCriteria()
    setSuccess(true)

    setTimeout(() => {
      setSuccess(false)
    }, 3000);
  }

  const handleUploadFile = async (data: any, file: any) => {
    const imageRef = ref(storage, `files/${file.name}-` + Math.random().toString())
    const firebaseData = await uploadBytes(imageRef, file)
    const url = await getDownloadURL(firebaseData.ref)
    handlOnChange(data, url)
  }

  const renderQuestion = (type: string, data: any, isDisable: boolean) => {
    switch (type) {
      case 'upload':
        if (data.answer) {
          return <div>
            Berkas
            <div className="input-group mb-3">
              {/* @ts-ignore */}
              <a href={data.answer} className="input-group-text" target="_blank">Berkas Terikirm</a>
              {/* <label className="input-group-text" htmlFor="inputGroupFile02">{isDisable ? 'Berkas Terikirm' : 'Kirim Berkas'}</label> */}
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
            <span>{data.question}</span>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <Input value={1} disabled={isDisable} checked={+data.answer == 1} className="form-check-input" type="radio" name="flexRadioDefault" onChange={(e) => handlOnChange(data, e.target.value)} />
                <span>1</span>
              </div>
              <div className="flex flex-col">
                <Input value={2} disabled={isDisable} checked={+data.answer == 2} className="form-check-input" type="radio" name="flexRadioDefault" onChange={(e) => handlOnChange(data, e.target.value)} />
                <span>2</span>
              </div>
              <div className="flex flex-col">
                <Input value={3} disabled={isDisable} checked={+data.answer == 3} className="form-check-input" type="radio" name="flexRadioDefault" onChange={(e) => handlOnChange(data, e.target.value)} />
                <span>3</span>
              </div>
              <div className="flex flex-col">
                <Input value={4} disabled={isDisable} checked={+data.answer == 4} className="form-check-input" type="radio" name="flexRadioDefault" onChange={(e) => handlOnChange(data, e.target.value)} />
                <span>4</span>
              </div>
              <div className="flex flex-col">
                <Input value={5} disabled={isDisable} checked={+data.answer == 5} className="form-check-input" type="radio" name="flexRadioDefault" onChange={(e) => handlOnChange(data, e.target.value)} />
                <span>5</span>
              </div>
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
                    {detail.questions > 0 &&
                      <a
                        data-toggle="modal"
                        data-target="#tabel1Modal"
                        className="btn btn-primary btn-icon-split"
                        onClick={() => handleOpenQuestion(detail.id)}
                        style={{
                          backgroundColor: detail.questions > 0 && !!detail.isCompleted ? '#C5D3E0' : '#0C6DFD',
                          color: detail.questions > 0 && !!detail.isCompleted ? 'black' : 'white',
                        }}
                      >
                        <span className="text">{detail.questions > 0 && !!detail.isCompleted ? 'Sudah di isi' : 'Isi Survei'}</span>
                      </a>
                    }
                  </div>
                  <Modal show={openQuestion && activeQuestion == detail.id} onHide={handleCloseQuestion}>
                    <Modal.Header closeButton>
                      <div>
                        <Modal.Title>Tabel {+i + 1}{e.criteria.length > 1 ? `.${+idx + 1}` : ''}</Modal.Title>
                        <Modal.Title>{detail.instrumentName}</Modal.Title>
                      </div>
                    </Modal.Header>
                    <Modal.Body>
                      <Form className="flex flex-col gap-3">
                        {questions.length ?
                          questions.map((e: any, i: Key) => {
                            return renderQuestion(e.questionType, e, detail.questions > 0 && !!detail.isCompleted)
                          }) : null
                        }
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      {detail.questions > 0 && !!detail.isCompleted ? null :
                        <>
                          <Button variant="secondary" onClick={handleCloseQuestion}>
                            Tutup
                          </Button>
                          <Button variant="primary" onClick={handleSubmit}>
                            Simpan
                          </Button>
                        </>
                      }
                    </Modal.Footer>
                  </Modal>
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

export default UserDashboard