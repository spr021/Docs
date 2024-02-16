import { Typography } from "@mui/material"
import { Link } from "react-router-dom"

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://spr021.github.io/Docs/">
        Saber Pourrahimi
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  )
}
