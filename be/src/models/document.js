const Sequelize = require("sequelize");
const sequelize = require("./index");
const Account = require("./account");
const Lecture = require("./lecture");
const Document = sequelize.define(
  "documents",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
    },
    link: {
      type: Sequelize.STRING,
    },
    lecture_id: {
      type: Sequelize.INTEGER,
    },
    created_at: {
      type: Sequelize.DATE,
    },
    created_by: {
      type: Sequelize.INTEGER,
    },
  },
  { timestamps: false, paranoid: false }
);
Document.hasOne(Lecture, {
  foreignKey: "lecture_id",
});
Lecture.belongsTo(Document, {
  foreignKey: "lecture_id",
  as: "documents",
});
Document.hasOne(Account, {
    foreignKey: "created_by",
});
Account.belongsTo(Document, {
    foreignKey: "created_by",
    as: "documents",
});

module.exports = Document;
