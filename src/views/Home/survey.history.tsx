import {Table } from "antd"
import useHome from "./useHome"
import { useEffect } from "react"
import { ProgressBar, Button } from "react-bootstrap"

const SurverHistory = () => {
  const {
    state: {
      instrumentQuestion
    },
    methods: {
      handleGetInstrumentQuestion,
    }
  } = useHome()

  const columns = [
    {
      title: 'No',
      render: (_: any, data: any, idx: any) => {
        return idx + 1
      }
    },
    {
      title: 'Status',
      dataIndex: 'approvalTypeCode',
      key: 'approvalTypeCode',
      render: (detail: string, data: any) => {
        console.log(data)

        if (detail == 'Disetujui') return <Button variant="success">{detail}</Button>
        if (detail == 'Tidak Disetujui') return <Button variant="danger">Dikembalikan</Button>
        if ((+data.answers / +data.questions) == 1 && !detail) return <Button variant="warning">Menunggu validasi</Button>
      }
    },
    {
      title: 'Daftar Instrument',
      dataIndex: 'instrumentName',
      key: 'instrumentName',
    },
    {
      title: 'Jumlah Pertanyaan',
      dataIndex: 'questions',
      key: 'questions',
    },
    {
      title: 'Progress',
      dataIndex: 'questions',
      key: 'questions',
      render: (_: any, data: any) => {
        if (+data.questions == 0) return null

        const now = Math.round(+data.answers / +data.questions * 100)
        return <ProgressBar now={now} label={`${now}%`} />
      }
    },
  ]

  useEffect(() => {
    handleGetInstrumentQuestion()
  }, [])

  return (
    <>
      <div className="w-full flex justify-between mb-2">
        <div className="text-xl mb-2"><b>Riwayat Status Survey</b></div>
      </div>
      <Table
        columns={columns}
        dataSource={instrumentQuestion}
      />
    </>
  )
}

export default SurverHistory