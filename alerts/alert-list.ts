
export const alertList = {
    validation_failed: {
        type: "error",
        text1: "error",
        text2: "failed to validate image",
    },
    update_success: {
        type: "ok",
        text1: "success",
        text2: "updated successfully",
    },
    update_failed: {
        type: "error",
        text1: "error",
        text2: "failed to update parameter",
    },
    save_success: {
        type: "ok",
        text1: "save success",
        text2: "saved successfully",
    },
    save_failed: {
        type: "error",
        text1: "error",
        text2: "save failed",
    },
    logout: {
        type: "confirm",
        text1: "logout",
        text2: "are you sure you want to logout",
    },
    clear_data: {
        type: "confirm",
        text1: "clear data",
        text2: "are you sure you want to clear data",
    },
    open_apk_failed: {
        type: "error",
        text1: "error",
        text2: "could not open apk file",
    },
    the_latest_version: {
        type: "ok",
        text1: "error",
        text2: "this is the latest version",
    },
    update_available: {
        type: "confirm",
        text1: "new version available",
        text2: "do you want to update",
    },
    network_error: {
        type: "warning",
        text1: "error",
        text2: "network error",
    },
    login_again: {
        type: "error",
        text1: "invalid user code",
        text2: "please login again",
    },
    refresh_token_failed: {
        type: "warning",
        text1: "error",
        text2: "failed to refresh token",
    },
    reset_settings: {
        type: "confirm",
        text1: "reset settings",
        text2: "are you sure you want to reset settings",
    },
    help: {
        type: "confirm",
        text1: "are you need help",
        text2: "this actions will open the help page",
    },
    password_mismatch: {
        type: "error",
        text1: "password mismatch",
        text2: "the passwords do not match, please try again",
    },
    logout_device: {
        type: "confirm",
        text1: "logout device",
        text2: "are you sure you want to logout of this device",
    },
    mark_all_as_read: {
        type: "confirm",
        text1: "mark all as read",
        text2: "are you sure you want to mark all notifications as read",
    },
    submit_form: {
        type: "confirm",
        text1: "submit",
        text2: "are you sure you want to submit the form",
    },
    reset_data: {
        type: "confirm",
        text1: "reset data",
        text2: "are you sure you want to reset exhibition data",
    },
    reload_data: {
        type: "confirm",
        text1: "reload data",
        text2: "are you sure you want to reload data",
    },
    change_company: {
        type: "confirm",
        text1: "change company",
        text2: "you will be redirected to the login screen to change company",
    },
    open_link: {
        type: "confirm",
        text1: "open link",
        text2: "are you sure you want to open this link",
    },
    file_picker_error: {
        type: "error",
        text1: "file picker error",
        text2: "an error occurred while picking the file",
    },
    permission_denied_photos: {
        type: "error",
        text1: "permission denied",
        text2: "please grant permission to access the media library",
    },
    delete_failed: {
        type: "error",
        text1: "error",
        text2: "failed to delete item",
    },
    camera_permission_denied: {
        type: "error",
        text1: "permission denied",
        text2: "please grant permission to access the camera",
    },
    capture_image_failed: {
        type: "error",
        text1: "error",
        text2: "failed to capture image",
    },
    delete_meeting_confirm: {
        type: "confirm",
        text1: "delete meeting",
        text2: "are you sure you want to delete this meeting",
    },
    complete_meeting_confirm: {
        type: "confirm",
        text1: "complete meeting",
        text2: "are you sure you want to complete this meeting",
    },
    delete_leave_request_confirm: {
        type: "confirm",
        text1: "delete leave request",
        text2: "are you sure you want to delete this leave request",
    },
    reject_leave_request_confirm: {
        type: "confirm",
        text1: "reject leave request",
        text2: "are you sure you want to reject this leave request",
    },
    approve_leave_request_confirm: {
        type: "confirm",
        text1: "approve leave request",
        text2: "are you sure you want to approve this leave request",
    },
    delete_overtime_report_confirm: {
        type: "confirm",
        text1: "delete overtime report",
        text2: "are you sure you want to delete this overtime report",
    },
    reject_overtime_report_confirm: {
        type: "confirm",
        text1: "reject overtime report",
        text2: "are you sure you want to reject this overtime report",
    },
    approve_overtime_report_confirm: {
        type: "confirm",
        text1: "approve overtime report",
        text2: "are you sure you want to approve this overtime report",
    },
    delete_room_confirm: {
        type: "confirm",
        text1: "delete room",
        text2: "are you sure you want to delete this room",
    },
    delete_comment_confirm: {
        type: "confirm",
        text1: "delete comment",
        text2: "are you sure you want to delete this comment",
    },
    disable_user_confirm: {
        type: "confirm",
        text1: "disable user",
        text2: "are you sure you want to disable this user",
    },
    approval_user_confirm: {
        type: "confirm",
        text1: "approve user",
        text2: "are you sure you want to approve this user",
    },
    cannot_activate_two_factor_authentication: {
        type: "error",
        text1: "cannot activate two-factor authentication",
        text2: "two-factor authentication cannot be activated from the app. open the web to activate it",
    },
} as const

export type AlertType = keyof typeof alertList