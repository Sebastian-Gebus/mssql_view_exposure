var config = {
    development: {

        url: 'http://localhost:3300/',

        server: {
            host: 'localhost',
            port_http: '3300',
            port_https: '3301',
            cert_path: '/path/to/cert.crt',
            key_path: '/path/to/key.key'
        },
        sql: {
            user: 'sql_user',
            password: 'password',
            server: 'host',
            database: 'db',
            requestTimeout: 60000,
            options: {
                trustedConnection: true,
                encrypt: true,
                enableArithAbort: true,
                trustServerCertificate: true,
            },
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 60000
            }
        },
        users: {
            'user': 'password'
        },
        allViews: [],
        filterViews: []
    },

    production: {

        url: '',

        server: {
            host: '',
            port_http: '',
            port_https: '',
            cert_path: '',
            key_path: ''
        },
        sql: {
            user: '',
            password: '',
            server: '',
            database: '',
            requestTimeout: 60000,
            options: {
                trustedConnection: true,
                encrypt: true,
                enableArithAbort: true,
                trustServerCertificate: true
            },
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 60000
            }
        },
        users: {
            '': ''
        },
        allViews: [],
        filterViews: []
    }
};

module.exports = config;