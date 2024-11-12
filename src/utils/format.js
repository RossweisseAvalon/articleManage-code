import { dayjs } from "element-plus"
// 时间格式化
export const formatTime = (time) => dayjs(time).format('YYYY年MM日DD日')