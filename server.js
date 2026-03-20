import Fastify from 'fastify'
import pkg from 'pg'
const { Pool } = pkg

const app = Fastify()

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sistema_chamados',
  password: 'senai',
  port: 5432,
})

app.get('/', () => 'ok')

app.post('/register', async (req) => {
  const { username, password } = req.body
  await pool.query('INSERT INTO usuarios VALUES (default,$1,$2)', [username, password])
  return 'criado'
})

app.post('/login', async (req) => {
  const { username, password } = req.body
  const r = await pool.query('SELECT * FROM usuarios WHERE username=$1 AND password=$2',[username,password])
  return r.rows.length ? 'ok' : 'erro'
})

app.post('/chamados', async (req) => {
  const { titulo, descricao, responsavel_id } = req.body
  const r = await pool.query(
    'INSERT INTO chamados(titulo,descricao,responsavel_id) VALUES($1,$2,$3) RETURNING *',
    [titulo, descricao, responsavel_id]
  )
  return r.rows[0]
})

app.get('/chamados/:id', async (req) => {
  const r = await pool.query('SELECT * FROM chamados WHERE id=$1',[req.params.id])
  return r.rows[0]
})

app.get('/chamados/responsavel/:id', async (req) => {
  const r = await pool.query('SELECT * FROM chamados WHERE responsavel_id=$1',[req.params.id])
  return r.rows
})

app.put('/chamados/:id', async (req) => {
  const { titulo, descricao } = req.body
  const r = await pool.query(
    'UPDATE chamados SET titulo=$1, descricao=$2 WHERE id=$3 RETURNING *',
    [titulo, descricao, req.params.id]
  )
  return r.rows[0]
})

app.delete('/chamados/:id', async (req) => {
  await pool.query('DELETE FROM chamados WHERE id=$1',[req.params.id])
  return 'apagado'
})

app.listen({ port: 3000 })