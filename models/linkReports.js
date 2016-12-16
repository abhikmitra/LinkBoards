/**
 * Created by Naveen on 16/12/16.
 */

var Sequelize = require("sequelize");
var sequelize = require("../sql/sequelize").sequelize;
var Q = require('q');

var LinkReports = sequelize.define('linkReports', {
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    link: {
        allowNull: false,
        type: Sequelize.STRING
    },
    report: {
        allowNull: false,
        type: Sequelize.TEXT
    }
}, {
    freezeTableName: true, // Model tableName will be the same as the model name
    getterMethods: {
        report: function() {
            return JSON.parse(this.getDataValue('report'));
        }
    },
    setterMethods: {
        report: function (value) {
            this.setDataValue('report', JSON.stringify(value))
        }
    }
});

sequelize.sync().then(function () {
    console.log("All Table Created");
});

LinkReports.upsertReport = function(link, report) {
    var deferred = Q.defer();
    return LinkReports
        .create({
            link: link,
            report: report
        })
        .then(function (record) {
            console.log("successfully saved cache entry for link ", link);
            return deferred.resolve(record);
        }, function(error) {
            console.log("error saving cache entry for link ", link, error);
            return deferred.reject(error);
        });
    return deferred.promise;
};

LinkReports.getReport = function (link) {
    var deferred = Q.defer();
    LinkReports
        .findOne({where: {
        link: link
    }})
        .then(function (row) {
            if (!row || row.length == 0) {
                return deferred.reject("Cache entry not found for link", link)
            }
            deferred.resolve(row.report);
        }, function (error) {
            console.log("error retrieving cache entry for link", link, error);
            return deferred.reject(error);
        });
    return deferred.promise;
}

module.exports = LinkReports;