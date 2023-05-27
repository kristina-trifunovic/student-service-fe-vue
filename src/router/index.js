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

import { cityLoadOneResolver } from "@/resolvers/city.resolver";
import { studentLoadOneResolver } from "@/resolvers/student.resolver";
import { subjectLoadOneResolver } from "@/resolvers/subject.resolver";
import { professorLoadOneResolver } from "@/resolvers/professor.resolver";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/city",
    name: "city",
    redirect: { name: "city-list" },
  },
  {
    path: "/city/list",
    name: "city-list",
    component: CityList,
  },
  {
    path: "/city/form",
    name: "city-add",
    component: CityForm,
  },
  {
    path: "/city/form/:id",
    name: "city-update",
    component: CityForm,
    beforeEnter: cityLoadOneResolver,
  },
  {
    path: "/student",
    name: "student",
    redirect: { name: "student-list" },
  },
  {
    path: "/student/list",
    name: "student-list",
    component: StudentList,
  },
  {
    path: "/student/form",
    name: "student-add",
    component: StudentForm,
  },
  {
    path: "/student/form/:username",
    name: "student-update",
    component: StudentForm,
    beforeEnter: studentLoadOneResolver,
  },
  {
    path: "/subject",
    name: "subject",
    redirect: { name: "subject-list" },
  },
  {
    path: "/subject/list",
    name: "subject-list",
    component: SubjectList,
  },
  {
    path: "/subject/form",
    name: "subject-add",
    component: SubjectForm,
  },
  {
    path: "/subject/form/:id",
    name: "subject-update",
    component: SubjectForm,
    beforeEnter: subjectLoadOneResolver,
  },
  {
    path: "/professor",
    name: "professor",
    redirect: { name: "professor-list" },
  },
  {
    path: "/professor/list",
    name: "professor-list",
    component: ProfessorList,
  },
  {
    path: "/professor/form",
    name: "professor-add",
    component: ProfessorForm,
  },
  {
    path: "/professor/form/:username",
    name: "professor-update",
    component: ProfessorForm,
    beforeEnter: professorLoadOneResolver,
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
});

export default router;
