const Account = require("../models/account");
const Role = require("../models/role");
const UserDetail = require("../models/user_detail");
const { Op, Sequelize } = require("sequelize");
const sequelize = require("../models/index");
const Course = require("../models/course");
const CourseMentor = require("../models/course_mentor");
const CourseStudent = require("../models/course_student");

exports.findAccountByEmail = async (email) => {
  const account = await Account.findOne({
    where: { email },
    attributes: ["account_id", "email", "password", "avatar", "active"],
    include: {
      model: Role,
      as: "roles",
    },
  });
  return account;
};

exports.resetPassword = async (email, password, updated_by) => {
  const { numberOfUpdated, updatedAccounts } = await Account.update(
    { password: password, updated_at: new Date(), updated_by: updated_by },
    { where: { email: email } }
  );

  return { numberOfUpdated, updatedAccounts };
};
exports.findAccountByEmailAndRolePaginate = async (
  email,
  role,
  page,
  pageSize
) => {
  const { count, rows } = await Account.findAndCountAll({
    limit: pageSize,
    offset: page * pageSize,
    attributes: [
      "account_id",
      "email",
      "name",
      "gender",
      "phone_number",
      "active",
    ],

    where: {
      email: { [Op.substring]: email },
      // role: { [Op.overlap]: role },
    },
    include: {
      model: Role,
      as: "roles",
      where: {
        name: { [Op.like]: { [Op.any]: role } },
      },
    },

    distinct: true,
  });
  return { count, rows };
};
exports.getUserDetail = async (email) => {
  const user = await Account.findOne({
    where: {
      email,
    },
    include: [
      {
        model: Role,
        as: "roles",
      },
      {
        model: UserDetail,
        as: "user_detail",
      },
    ],
  });
  return user;
};
exports.getStudentDetail = async (email) => {
  const user = await Account.findOne({
    where: {
      email,
    },
    include: [
      {
        model: Role,
        as: "roles",
      },
      {
        model: UserDetail,
        as: "user_detail",
      },
      {
        model: CourseStudent,
        as: "courses_students",
        include: {
          model: Course,
          as: "courses",
          attributes: ["name", "status"],
          where: {
            status: "3",
          },
        },
      },
    ],
  });
  return user;
};

exports.findAccountByRole = async (role) => {
  return await Account.findAll({
    attributes: [
      "account_id",
      "email",
      "name",
      "phone_number",
      "active",
      "university",
      "work_place",
      "level",
      "dob",
    ],

    where: {
      "$roles.name$": { [Op.eq]: role },
    },
    include: {
      model: Role,
      as: "roles",
      duplicating: false,
    },
    distinct: true,
  });
};

exports.findMentorsByCourseId = async (course_id) => {
  return await Account.findAll({
    attributes: [
      "account_id",
      "email",
      "name",
      "role",
      "active",
      "phone_number",
      "work_place",
      "level",
      "university",
      "dob",
    ],
    include: [
      {
        model: CourseMentor,
        as: "courses_mentors",
        duplicating: false,
        where: {
          course_id: course_id,
          status: true,
        },
      },
      {
        model: Role,
        as: "roles",
      },
    ],
    distinct: true,
  });
};

exports.findStudentsByCourseId = async (course_id) => {
  return await Account.findAll({
    attributes: [
      "account_id",
      "email",
      "name",
      "phone_number",
      "active",
      "university",
      "dob",
    ],
    include: {
      model: CourseStudent,
      as: "courses_students",
      duplicating: false,
      where: {
        course_id: course_id,
      },
    },
    distinct: true,
  });
};

exports.findAccountByRoles = async (roles) => {
  console.log(roles);
  return await Account.findAll({
    attributes: [
      "account_id",
      "email",
      "name",
      "phone_number",
      "active",
      "university",
      "work_place",
      "level",
      "dob",
    ],
    where: {
      "$roles.name$": { [Op.or]: roles },
    },
    include: {
      model: Role,
      as: "roles",
      duplicating: false,
    },
    distinct: true,
  });
};

exports.updateAccountStatus = async (email, status, updated_by) => {
  const numberOfUpdated = await Account.update(
    { active: status, updated_at: new Date(), updated_by: updated_by },
    { where: { email: email } }
  );
  console.log({ numberOfUpdated });
  const updatedAccount = await Account.findOne({
    attributes: [
      "account_id",
      "email",
      "name",
      "gender",
      "phone_number",
      "active",
      "role",
    ],

    where: {
      email: { [Op.eq]: email },
    },
    include: {
      model: Role,
      as: "roles",
    },
    distinct: true,
  });
  return { numberOfUpdated, updatedAccount };
};

exports.updateAccount = async (email, account, roles, updated_by) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      await Account.update(
        {
          name: account?.name,
          gender: account?.gender,
          phone_number: account?.phone,
          managed_by: Number.parseInt(account?.manager),
          updated_at: new Date(),
          updated_by: updated_by,
          dob: account?.birthday,
        },

        { where: { email: email } },
        { transaction: t }
      );
      const updated_account = await Account.findOne({
        where: { email: email },
      });
      await UserDetail.update(
        {
          address: account?.address,
          hired_date: account?.hired_date,
          start_working_time: account?.start,
          end_working_time: account?.end,
          grant: account?.grant,
        },

        { where: { account_id: updated_account.detail_id } },
        { transaction: t }
      );
      await updated_account.setRoles([], {
        transaction: t,
      });

      await updated_account.setRoles(roles, {
        transaction: t,
      });
    });
  } catch (e) {
    console.log(e);
    throw e;
  }

  const updatedAccount = await Account.findOne({
    attributes: [
      "account_id",
      "email",
      "name",
      "gender",
      "phone_number",
      "active",
    ],

    where: {
      email: { [Op.eq]: email },
    },
    include: {
      model: Role,
      as: "roles",
    },
    distinct: true,
  });
  return updatedAccount;
};

exports.createNewAccount = async (account, roles, password, created_by) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const user_detail = await UserDetail.create(
        {
          address: account?.address,
          hired_date: account?.hired_date,
          start_working_time: account?.start,
          end_working_time: account?.end,
          grant: account?.grant,
        },
        { transaction: t }
      );

      const created_account = await Account.create(
        {
          name: account?.name,
          email: account?.email,
          gender: account?.gender,
          phone_number: account?.phone,
          password: password,
          managed_by: Number.parseInt(account?.manager || 1),
          created_at: new Date(),
          created_by: created_by,
          dob: account?.birthday,
          detail_id: user_detail.account_id,
          active: true,
        },
        { transaction: t }
      );

      await created_account.setRoles(roles, {
        transaction: t,
      });
    });
  } catch (e) {
    console.log(e);
    throw e;
  }

  const updatedAccount = await Account.findOne({
    attributes: [
      "account_id",
      "email",
      "name",
      "gender",
      "phone_number",
      "active",
    ],

    where: {
      email: { [Op.eq]: account?.email },
    },
    include: {
      model: Role,
      as: "roles",
    },
    distinct: true,
  });
  return updatedAccount;
};
