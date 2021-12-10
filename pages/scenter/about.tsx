import Divider from '@mui/material/Divider'
import AuthCheck from 'hoc/authCheck'
import Head from 'next/head'

const about = () => {
  return (
    <>
      <Head>
        <title>PIIC 소개 | PIIC</title>
      </Head>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '2rem 0',
          height: '90vh',
        }}
      >
        <div style={{ width: '90%' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            About PIIC!
          </h1>
          <br />
          <Divider></Divider>
          <br />
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque
            dolores accusantium quod quaerat porro necessitatibus eos et
            deserunt nisi? Quo blanditiis voluptas repudiandae ullam dolore
            aliquid labore molestias doloribus modi sunt sapiente ipsum a
            voluptates corporis reiciendis perferendis, mollitia voluptatum
            repellat ipsa nam maiores consequuntur, iste adipisci. Omnis maiores
            maxime, ipsam, error quasi dolorem facilis ex cum aspernatur
            deleniti eius nemo numquam optio, ipsum libero? Quos, necessitatibus
            eveniet omnis delectus molestias cumque dolorum quam amet quas.
            Nostrum assumenda tempora dolorem autem asperiores. Inventore est
            sequi cumque impedit error, atque, quia eligendi, dolore laudantium
            beatae eos porro dolores nemo debitis assumenda.
          </p>
        </div>
      </div>
    </>
  )
}

export default AuthCheck(about, null)
