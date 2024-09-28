class ApiResponse {
    constructor(stausCode, data, message = "maybe success"){
        this.stausCode = stausCode
        this.data = data
        this.message = message
        this.success = stausCode < 400
    }
}