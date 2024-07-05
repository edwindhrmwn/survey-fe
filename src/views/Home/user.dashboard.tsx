
import { Key, useEffect, useState } from "react"
import useHome from "./useHome"

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Input } from "antd";
import { UploadOutlined } from '@ant-design/icons';

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

  useEffect(() => {
    handleGetCategoryCriteria()
  }, [])

  const handleOpenQuestion = (id: number) => {
    setOpenQuestion(true)
    handleGetQuestionByInstrument(id)
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
  }

  const renderQuestion = (type: string, data: any) => {
    switch (type) {
      case 'upload':
        return (
          <div className="row">
            <div className="col-md-2" style={{ maxWidth: 100 }} />
            <div className="col-md-2">

              <input
                hidden
                type="file"
                id="attachedDocumentProposal"
                name="attachedDocumentProposal"
              // onChange={readUploadFile}
              />
              <label
                // type="primary"
                htmlFor="attachedDocumentProposal"
                style={{
                  fontSize: 14,
                  marginBottom: 0,
                  color: "#11468F",
                  cursor: "pointer",
                }}
                className="ifocus-btn-blue-outline d-flex align-items-center justify-content-center"
              >
                <UploadOutlined style={{ marginRight: 5 }} /> Attach Document
              </label>
            </div>
          </div>
        )
      case 'essay':
        return (
          <div>
            <span>{data.question}</span>
            <Input onChange={(e) => handlOnChange(data, e.target.value)} />
          </div>
        )
      case 'options':
        return (
          <>
            <span>{data.question}</span>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <Input value={1} className="form-check-input" type="radio" name="flexRadioDefault" onChange={(e) => handlOnChange(data, e.target.value)} />
                <span>1</span>
              </div>
              <div className="flex flex-col">
                <Input value={2} className="form-check-input" type="radio" name="flexRadioDefault" onChange={(e) => handlOnChange(data, e.target.value)} />
                <span>2</span>
              </div>
              <div className="flex flex-col">
                <Input value={3} className="form-check-input" type="radio" name="flexRadioDefault" onChange={(e) => handlOnChange(data, e.target.value)} />
                <span>3</span>
              </div>
              <div className="flex flex-col">
                <Input value={4} className="form-check-input" type="radio" name="flexRadioDefault" onChange={(e) => handlOnChange(data, e.target.value)} />
                <span>4</span>
              </div>
              <div className="flex flex-col">
                <Input value={5} className="form-check-input" type="radio" name="flexRadioDefault" onChange={(e) => handlOnChange(data, e.target.value)} />
                <span>5</span>
              </div>
            </div>
          </>
        )
      default:
        break;
    }
  }

  return (
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
                  <a className="btn btn-primary btn-icon-split" data-toggle="modal" data-target="#tabel1Modal" onClick={() => handleOpenQuestion(e.id)}>
                    <span className="text">Isi Survei</span>
                  </a>
                </div>
              </div>
            })}
          </div>
        </div>
      })}

      <Modal show={openQuestion} onHide={() => setOpenQuestion(!openQuestion)}>
        <Modal.Header closeButton>
          <Modal.Title>Tabel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="flex flex-col gap-3">
            {questions.length ?
              questions.map((e: any, i: Key) => {
                return renderQuestion(e.questionType, e)
              }) : null
            }
            {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                autoFocus
                onChange={(e: any) => setUserEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                placeholder="User Name"
                onChange={(e: any) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
              onChange={(e: any) => setUserPassword(e.target.value)}
            >
              <Form.Label>Password</Form.Label>
              <Form.Control as="input" />
            </Form.Group> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpenQuestion(!openQuestion)}>
            Tutup
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default UserDashboard