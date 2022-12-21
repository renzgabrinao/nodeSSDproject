"use strict";

class RequestService {
    // Constructor
    RequestService() {}
    reqHelper(req) {
    // Send username and login status to view if authenticated.
    if (req.isAuthenticated()) {
        return { authenticated: true, username: req.user.username, role: req.user.role, id: req.user.id };
    }
    // Send logged out status to form if not authenticated.
    else {
        return { authenticated: false };
    }
    }
}
module.exports = new RequestService();

