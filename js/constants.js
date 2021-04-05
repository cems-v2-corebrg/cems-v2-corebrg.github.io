; "use strict";

const
    ALERT_NO_PERMISSION = {
        kr: "Warning.\n\n권한 없음."
    },
    CONFIRM_SIGNOUT = {
        kr: "Confirm.\n\n로그 아웃 하겠습니까?"
    },
    CONFIRM_APPLY_MUTE = {
        kr: "Confirm.\n\n브라우저 새로고침 후 반영됩니다.\n계속 하겠습니까?"
    },
    CONFIRM_REMOVE = target => {
        return {
            kr: `Confirm.\n\n${target || ""}삭제 하겠습니까?`
        }
    },
    ERROR_FILE_READ = {
        kr: "Error!\n\n파일 읽기 오류."
    },
    ERROR_FILE_INVAL = {
        kr: "Error!\n\n파일 형식 오류."
    },
    ERROR_CHART_NOSUP = {
        kr: "Error!\n\n차트를 제공하지 않습니다."
    },
    ERROR_RES_CODE = code => {
        return {
            kr: `Error!\n\n오류코드 ${code}.`
        }
    },
    INFO_SET_CRITICAL = {
        kr: "Information.\n\n임계 설정 정상."
    },
    INFO_SET_SYSLOG = {
        kr: "Information.\n\nSyslog 설정 정상."
    },
    CONST_PATH = {
        kr: "경로를 "
    },
    NOTICE_SESS_EXPIRE = {
        kr: "Notice!\n\n세션 만료."
    }