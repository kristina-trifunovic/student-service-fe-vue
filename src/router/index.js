import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import CityForm from "@/views/cities/CityForm.vue";
import CityList from "@/views/cities/CityList.vue";
import StudentForm from "@/views/students/StudentForm.vue";
import StudentList from "@/views/students/StudentList.vue";
import SubjectForm from "@/views/subjects/SubjectForm.vue";
import SubjectList from "@/views/subjects/SubjectList.vue";
import ProfessorForm from "@/views/professors/ProfessorForm.vue";
import ProfessorList from "@/views/professors/ProfessorList.vue";
import ExamPeriodForm from "@/views/exam-periods/ExamPeriodForm.vue";
import ExamForm from "@/views/exams/ExamForm.vue";

import { cityLoadOneResolver } from "@/resolvers/city.resolver";
import { studentLoadOneResolver } from "@/resolvers/student.resolver";
import { subjectLoadOneResolver } from "@/resolvers/subject.resolver";
import { professorLoadOneResolver } from "@/resolvers/professor.resolver";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      roles: ["ROLE_ADMIN", "ROLE_PROFESSOR", "ROLE_STUDENT"],
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/city",
    redirect: { name: "city-list" },
    meta: {
      roles: ["ROLE_ADMIN"],
    },
    children: [
      {
        path: "list",
        name: "city-list",
        component: CityList,
      },
      {
        path: "form",
        name: "city-add",
        component: CityForm,
      },
      {
        path: "form/:id",
        name: "city-update",
        component: CityForm,
        beforeEnter: cityLoadOneResolver,
      },
    ],
  },

  {
    path: "/student",
    redirect: { name: "student-list" },
    meta: {
      roles: ["ROLE_ADMIN", "ROLE_STUDENT"],
    },
    children: [
      {
        path: "list",
        name: "student-list",
        component: StudentList,
      },
      {
        path: "form",
        name: "student-add",
        component: StudentForm,
      },
      {
        path: "form/:username",
        name: "student-update",
        component: StudentForm,
        beforeEnter: studentLoadOneResolver,
      },
    ],
  },

  {
    path: "/subject",
    redirect: { name: "subject-list" },
    meta: {
      roles: ["ROLE_ADMIN"],
    },
    children: [
      {
        path: "list",
        name: "subject-list",
        component: SubjectList,
      },
      {
        path: "form",
        name: "subject-add",
        component: SubjectForm,
      },
      {
        path: "form/:id",
        name: "subject-update",
        component: SubjectForm,
        beforeEnter: subjectLoadOneResolver,
      },
    ],
  },

  {
    path: "/professor",
    redirect: { name: "professor-list" },
    meta: {
      roles: ["ROLE_ADMIN"],
    },
    children: [
      {
        path: "list",
        name: "professor-list",
        component: ProfessorList,
      },
      {
        path: "form",
        name: "professor-add",
        component: ProfessorForm,
      },
      {
        path: "form/:username",
        name: "professor-update",
        component: ProfessorForm,
        beforeEnter: professorLoadOneResolver,
      },
    ],
  },

  {
    path: "/exam-period",
    meta: {
      roles: ["ROLE_ADMIN"],
    },
    children: [
      {
        path: "form",
        name: "exam-period-add",
        component: ExamPeriodForm,
      },
    ],
    // redirect: { name: "exam-period-list" },
  },
  {
    path: "/exam",
    meta: {
      roles: ["ROLE_ADMIN", "ROLE_PROFESSOR"],
    },
    children: [
      {
        path: "form",
        name: "exam-add",
        component: ExamForm,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  if (!sessionStorage.getItem("user") && to.name !== "login") {
    return { name: "login" };
  }
  if (sessionStorage.getItem("user") && to.name == "login") {
    return { name: "home" };
  }
  if (sessionStorage.getItem("user")) {
    const roles = to.meta["roles"];
    const roleExists = JSON.parse(
      sessionStorage.getItem("user")
    ).authorities.some((authority) => roles.includes(authority.authority));
    console.log(roleExists);
    if (!roleExists) {
      return { name: "home" };
      // toast.add({
      //   severity: "error",
      //   summary: t("messages.authorization_error"),
      //   detail: "",
      //   life: 3000,
      // });
    }
  }
});

export default router;
