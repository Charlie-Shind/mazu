import { ElNotification,ElMessageBox } from 'element-plus'
import nprogress from 'nprogress'
// 消息提示
// 成功success
export function successToast(message,type = "success",dangerouslyUseHTMLString = false){
    ElNotification({
        message,
        type,
        dangerouslyUseHTMLString,
        duration:3000
    })
}

// 失败error
export function errorToast(message,type = "error",dangerouslyUseHTMLString = false){
  ElNotification({
      message,
      type,
      dangerouslyUseHTMLString,
      duration:3000
  })
}

// 显示全屏loading
export function showFullLoading(){
  nprogress.start()
}

// 隐藏全屏loading
export function hideFullLoading(){
  nprogress.done()
}

export function showModal(content = "提示内容",type = "warning",title = ""){
    return ElMessageBox.confirm(
        content,
        title,
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type,
        }
      )
}
