import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"

const Dayjs = dayjs

Dayjs.extend(relativeTime)

export default Dayjs