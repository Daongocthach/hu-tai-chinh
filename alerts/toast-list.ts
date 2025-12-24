
export const toastList = {
  login_success: {
    type: "success",
    text1: "login success",
    text2: "welcome back",
  },
  login_failed: {
    type: "error",
    text1: "login failed",
    text2: "please check your credentials",
  },
  sign_up_success: {
    type: "success",
    text1: "sign up success",
    text2: "created account successfully",
  },
  logout_success: {
    type: "success",
    text1: "logout success",
    text2: "see you later",
  },
  update_success: {
    type: "success",
    text1: "update success",
    text2: "updated successfully",
  },
  logout_failed: {
    type: "error",
    text1: "logout failed",
    text2: "please try again",
  },
  fill_all_fields: {
    type: "error",
    text1: "please fill all fields",
    text2: "",
  },
  save_data_successfully: {
    type: "success",
    text1: "save data successfully",
    text2: "",
  },
  added_fail: {
    type: "error",
    text1: "added fail",
    text2: "",
  },
  reject_success: {
    type: "success",
    text1: "reject success",
    text2: "",
  },
  submit_success: {
    type: "success",
    text1: "submitted successfully",
    text2: "",
  },
  submit_fail: {
    type: "error",
    text1: "submit failed",
    text2: "",
  },
  delete_success: {
    type: "success",
    text1: "delete success",
    text2: "",
  },
  delete_failed: {
    type: "error",
    text1: "delete failed",
    text2: "",
  },
  create_success: {
    type: "success",
    text1: "create success",
    text2: "",
  },
  create_failed: {
    type: "error",
    text1: "create failed",
    text2: "",
  },
  network_error: {
    type: "error",
    text1: "error",
    text2: "network error",
  },
  validate_success: {
    type: "success",
    text1: "validate success",
    text2: "device validated successfully",
  },
  validate_fail: {
    type: "error",
    text1: "validate failed",
    text2: "device validation failed",
  },
  successfully_connected: {
    type: "success",
    text1: "successfully connected",
    text2: "",
  },
  successfully_disconnected: {
    type: "success",
    text1: "successfully disconnected",
    text2: "",
  },
  avatar_updated: {
    type: "success",
    text1: "avatar updated successfully",
    text2: "",
  },
  reset_settings_success: {
    type: "success",
    text1: "reset settings success",
    text2: "settings have been reset to default",
  },
  comment_sent_successfully: {
    type: "success",
    text1: "comment sent successfully",
    text2: "",
  },
  join_meeting_success: {
    type: "success",
    text1: "joined meeting successfully",
    text2: "",
  },
  complete_meeting_success: {
    type: "success",
    text1: "completed meeting successfully",
    text2: "",
  },
  otp_sent_success: {
    type: "success",
    text1: "otp sent successfully",
    text2: "",
  },
  disable_success: {
    type: "success",
    text1: "disable success",
    text2: "",
  },
  enable_success: {
    type: "success",
    text1: "enable success",
    text2: "",
  },
} as const

export type ToastType = keyof typeof toastList