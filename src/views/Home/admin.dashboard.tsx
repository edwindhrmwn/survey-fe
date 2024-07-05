import { Key, useEffect, useState } from "react"
import useHome from "./useHome"

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ArrowLeftOutlined } from "@ant-design/icons"
import { Table, TableColumnsType } from "antd";

const AdminDashboard = () => {
  const {
    state: {
      categoryCriteria,
      questions,
    },
    methods: {
      handleSubmitAnswer,
      handleGetCategoryCriteriaAdmin,
    }
  } = useHome()

  const [openQuestion, setOpenQuestion] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [showSuccess, setSuccess] = useState(false)
  const [openRespondenInstrument, setOpenRespondenInstrument] = useState(false)

  useEffect(() => {
    handleGetCategoryCriteriaAdmin()
  }, [])


  const handleCloseQuestion = () => {
    setOpenQuestion(false)
    setActiveQuestion(0)
  }

  const handleSubmit = async () => {
    await handleSubmitAnswer(questions)
    setOpenQuestion(!openQuestion)
    handleGetCategoryCriteriaAdmin()
    setSuccess(true)

    setTimeout(() => {
      setSuccess(false)
    }, 3000);
  }

  if (openRespondenInstrument) {
    const columns: TableColumnsType<any> | undefined = []
    return <div className="flex flex-col gap-1">
      <div className="w-full flex justify-between mb-2">
        <div className="text-xl mb-2"><b>List Respon</b></div>
      </div>
      <div className="w-full flex justify-between mb-2">
        <span className="cursor-pointer" onClick={() => setOpenRespondenInstrument(false)}><ArrowLeftOutlined /></span>
      </div>
      {/* <Table columns={columns} dataSource={}/> */}
    </div>
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
                      onClick={() => setOpenRespondenInstrument(true)}
                      style={{
                        backgroundColor: detail.questions > 0 && !!detail.isCompleted ? '#C5D3E0' : '#0C6DFD',
                        color: detail.questions > 0 && !!detail.isCompleted ? 'black' : 'white',
                      }}
                    >
                      <span className="text">{detail.responden == "" ? "" : detail.responden} Responden</span>
                    </a>
                  </div>
                  <Modal show={openQuestion && activeQuestion == detail.id} onHide={handleCloseQuestion}>
                    <Modal.Header closeButton>
                      <div>
                        <Modal.Title>Tabel {+i + 1}{e.criteria.length > 1 ? `.${+idx + 1}` : ''}</Modal.Title>
                        <Modal.Title>{detail.instrumentName}</Modal.Title>
                      </div>
                    </Modal.Header>
                    <Modal.Body>
                      {/* <Form className="flex flex-col gap-3">
                        {questions.length ?
                          questions.map((e: any, i: Key) => {
                            return renderQuestion(e.questionType, e, detail.questions > 0 && !!detail.isCompleted)
                          }) : null
                        }
                      </Form> */}
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

export default AdminDashboard