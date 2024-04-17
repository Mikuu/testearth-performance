export default {

    // systemTags will be flushed to influxdb, however not all tags are useful, reduce unnecessary tags can save the
    // flushing time and reduce the possibility for errors.
    systemTags: [
        // "proto",
        // "subproto",
        // "status",
        // "method",
        // "url",
        // "name",
        // "group",
        "check",    // only keep this
        // "error",
        // "error_code",
        // "tls_version",
        // "scenario",
        // "service",
        // "expected_response"
    ],
    summaryTrendStats: [
        "avg",
        "min",
        "max",
        "med",
        "p(30)",
        "p(50)",
        "p(80)",
        "p(90)",
        "p(95)"
    ],
};
