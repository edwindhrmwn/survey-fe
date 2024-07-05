import { Table } from "antd"
import useHome from "./useHome"
import { useEffect } from "react"
import { ProgressBar } from "react-bootstrap"

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
      render: (detail: any, data: any) => {
        console.log(data, detail)
        if (+data.questions == 0) return null

        const now = +data.answers / +data.questions * 100
        return <ProgressBar now={now} label={`${now}%`} />
      }
    },
  ]

  useEffect(() => {
    handleGetInstrumentQuestion()
  }, [])

  return (
    <>
      <Table
        columns={columns}
        dataSource={instrumentQuestion}
      />
    </>
  )
}

export default SurverHistory