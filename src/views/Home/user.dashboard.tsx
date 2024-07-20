import { Key, useEffect, useState } from "react"
import useHome from "./useHome"

// @ts-ignore
import { storage } from "../../../firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Collapse, Input } from "antd";
import TextArea from "antd/es/input/TextArea";

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
  const [errorUpload, setErrorUpload] = useState('')
  const [disableSubmit, setDisableSubmit] = useState(false)
  const [acceptedType, _] = useState([
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ])

  useEffect(() => {
    handleGetCategoryCriteria()
  }, [])

  const handleOpenQuestion = (id: number) => {
    setOpenQuestion(true)
    setActiveQuestion(id)
    handleGetQuestionByInstrument(id, sessionStorage.getItem('userId') || '')
  }

  const handleCloseQuestion = () => {
    setOpenQuestion(false)
    setActiveQuestion(0)
    setErrorUpload('')
  }

  const handlOnChange = (data: any, answer: any, additionalAnswer?: any) => {
    const rs: any = []
    // console.log(data, answer, additionalAnswer)
    // console.log({ questions })
    for (const question of questions) {
      const detail: any = question

      if (detail.questionGroupName) {
        if (detail.questionGroupName == data.questionGroupName) {
          const rawData = []
          for (const question2 of detail.data) {
            const detail2: any = question2

            if (detail2?.id == data.id) {
              rawData.push({
                ...detail2,
                questionId: detail2.id,
                userId: sessionStorage.getItem('userId'),
                answer,
                additionalAnswer,
                instrumentId: detail2.instrumentId,
              })
            } else {
              rawData.push({
                ...detail2,
                questionId: detail2.id,
                userId: sessionStorage.getItem('userId'),
                instrumentId: detail2.instrumentId,
              })
            }
          }
          rs.push({
            ...detail,
            userId: sessionStorage.getItem('userId'),
            instrumentId: detail.instrumentId,
            data: rawData,
          })
          continue
        }

        rs.push({
          ...detail,
          data: detail.data.map((e: any) => {
            return {
              ...e,
              questionId: e.id,
              userId: sessionStorage.getItem('userId'),
              instrumentId: e.instrumentId,
            }
          })
        })
        continue
      }

      if (detail?.id == data.id) {
        rs.push({
          ...detail,
          questionId: detail.id,
          userId: sessionStorage.getItem('userId'),
          answer,
          additionalAnswer,
          instrumentId: detail.instrumentId,
        })
      } else {
        rs.push({
          ...detail,
          questionId: detail.id,
          userId: sessionStorage.getItem('userId'),
          instrumentId: detail.instrumentId,
        })
      }
    }

    console.log(rs)

    setQuestion(rs)
  }

  const handleSubmit = async () => {
    setDisableSubmit(true)
    const data = questions.map((v: any) => ({ ...v, approvalTypeId: null, approvalTypeCode: '' }))

    await handleSubmitAnswer(data)
    await handleGetCategoryCriteria()

    setOpenQuestion(!openQuestion)
    setSuccess(true)

    setTimeout(() => {
      setSuccess(false)
      setDisableSubmit(false)
    }, 3000);
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
        if (data.answer && !data.notSubmitYet && isDisable) {
          return <div>
            <div>Berkas yang diunggah</div>
            <div style={{ fontSize: 10, marginBottom: 5 }}>File harus berekstensi .doc, .docx, .xls, .xlsx, atau .pdf, .txt. Maks. 1 MB</div>
            <div className="input-group mb-3">
              {/* @ts-ignore */}
              <a href={data.answer} className="input-group-text" target="_blank">Berkas Terikirm</a>
              {/* <label className="input-group-text" htmlFor="inputGroupFile02">{isDisable ? 'Berkas Terikirm' : 'Kirim Berkas'}</label> */}
            </div>
          </div>
        }

        return (
          <div key={errorUpload}>
            <div>Berkas yang diunggah</div>
            <div style={{ fontSize: 10, marginBottom: 5 }}>File harus berekstensi .doc, .docx, .xls, .xlsx, atau .pdf, .txt. Maks. 1 MB</div>
            <div className="input-group mb-3">
              <input
                id="inputGroupFile02"
                type="file"
                accept='.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.xls,.xlsx,.pdf'
                disabled={isDisable}
                className="form-control"
                onChange={(e: any) => {
                  setErrorUpload('')
                  console.log(e.target.files[0])
                  if (e.target.files[0].size > 1048576) return setErrorUpload('Maksimal ukuran data 1 MB')
                  if (!acceptedType.includes(e.target.files[0].type)) return setErrorUpload('Unggah file sesuai ekstensi yang sudah ditentukan')

                  // @ts-ignore
                  handleUploadFile(data, e.target.files[0])
                }}
              />
              <label className="input-group-text" htmlFor="inputGroupFile02">{isDisable ? 'Berkas Terikirm' : 'Kirim Berkas'}</label>
            </div>
            {!!errorUpload &&
              <div className="text-red-500 text-xs">*{errorUpload}</div>
            }
          </div>
        )
      case 'essay':
        return (
          <div>
            <span>{data.question}</span>
            <Input value={data?.answer || ''} disabled={isDisable} onChange={(e) => handlOnChange(data, e.target.value)} />
          </div>
        )
      case 'essay area':
        return (
          <div>
            <span>{data.question}</span>
            <TextArea value={data?.answer || ''} disabled={isDisable} onChange={(e) => handlOnChange(data, e.target.value)} />
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
                let btnText = 'Isi Survei'
                if (detail.approvalTypeCode == 'Disetujui') btnText = detail.approvalTypeCode
                if (detail.approvalTypeCode == 'Tidak Disetujui') btnText = "Isi Ulang Survei"
                if (!detail.approvalTypeCode && detail.isCompleted) btnText = 'Menunggu Validasi'

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
                        <span className="text">{btnText}</span>
                      </a>
                    }
                  </div>
                  <Modal show={openQuestion && activeQuestion == detail.id} onHide={handleCloseQuestion} style={{ minWidth: 600 }}>
                    <Modal.Header closeButton>
                      <div>
                        <Modal.Title>Tabel {+i + 1}{e.criteria.length > 1 ? `.${+idx + 1}` : ''}</Modal.Title>
                        <Modal.Title>{detail.instrumentName}</Modal.Title>
                      </div>
                    </Modal.Header>
                    <Modal.Body>
                      <Form className="flex flex-col w-full gap-3">
                        {questions.length ?
                          questions.map((e: any, i: Key) => {

                            if (!!e.questionGroupName) {
                              return <Collapse
                                key={i}
                                defaultActiveKey={["0"]}
                                expandIconPosition="start"
                              >
                                <Collapse.Panel key={i} header={e.questionGroupName}>
                                  {e.data.map((rowQuestion: any, idx: Key) => {
                                    return <span key={idx} className="space-y-2">
                                      {renderQuestion(rowQuestion.questionType, rowQuestion, detail.questions > 0 && !!detail.isCompleted && detail.approvalTypeCode != 'Tidak Disetujui', +idx)}
                                    </span>
                                  })}
                                </Collapse.Panel>
                              </Collapse>
                            }

                            return <span key={i}>
                              {renderQuestion(e.questionType, e, detail.questions > 0 && !!detail.isCompleted && detail.approvalTypeCode != 'Tidak Disetujui', +i)}
                            </span>
                          }) : null
                        }
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      {(detail.questions > 0 && !!detail.isCompleted && detail.approvalTypeCode != 'Tidak Disetujui') ? null :
                        <>
                          <Button variant="secondary" onClick={handleCloseQuestion}>
                            Tutup
                          </Button>
                          <Button variant="primary" disabled={disableSubmit} onClick={handleSubmit}>
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