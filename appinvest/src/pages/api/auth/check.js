export default function handler(req, res) {
  const token = req.cookies.access_token;
  if (token) return res.status(200).end();
  return res.status(401).end();
}
