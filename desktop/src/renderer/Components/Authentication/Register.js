import React, { useState } from "react";
import server from "../../Functions/methods/Server/server";
import {
  LoginWrapper as RegisterWrapper,
  FormWrapper,
  FormGroup,
  TextInput,
  Submit,
  SelectInput,
  SelectOption,
} from "../../Assets/styled/authentication";

import { toast } from "../Toast";
import ErrorHandler from "../../Functions/methods/Server/axiosErrorHandler";

const initialState = {
  user_name: "",
  number: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  phone_number: "",
  gender: "",
  password: "",
  password_confirm: "",
  state: "",
  city: "",
  center: "",
};
export default function Register({ userState }) {
  const [user] = userState;

  const [formValues, setFormValues] = useState(initialState);

  const onInputChange = function (inputName) {
    return function (e) {
      setFormValues({ ...formValues, [inputName]: e.target.value });
    };
  };

  const onFormSubmit = function () {
    if (!formValues.number || !formValues.password) return;
    const body = {
      user_name: formValues.number,
      number: formValues.number,
      first_name: formValues.number,
      middle_name: formValues.number,
      last_name: formValues.number,
      phone_number: formValues.number,
      gender: "male",
      password: formValues.password,
      password_confirm: formValues.password,
      state: "--",
      city: "--",
      center: "--",
    };
    server
      .post("/register", body, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((data) => {
        toast("تم اضافة المستخدم");
        setFormValues(initialState);
      })
      .catch((err) => {
        const errMsg = ErrorHandler(err);
        toast(errMsg);
        console.log(errMsg);
      });
  };

  return (
    <RegisterWrapper>
      <FormWrapper>
        <div
          style={{ display: "flex", gap: 12, justifyContent: "space-evenly" }}
        >
          <div style={{ width: "50%" }}>
            {/*    <FormGroup>
              <TextInput
                value={formValues.user_name}
                onChange={onInputChange("user_name")}
                placeholder="user_name"
              />
              
              
            </FormGroup>
              */}
            <FormGroup>
              <TextInput
                value={formValues.number}
                onChange={onInputChange("number")}
                placeholder="number"
              />
            </FormGroup>

            {/*      <FormGroup>
              <TextInput
                value={formValues.first_name}
                onChange={onInputChange("first_name")}
                placeholder="first_name"
              />
            </FormGroup>
            <FormGroup>
              <TextInput
                value={formValues.middle_name}
                onChange={onInputChange("middle_name")}
                placeholder="middle_name"
              />
            </FormGroup> */}
            {/*        <FormGroup>
              <TextInput
                value={formValues.last_name}
                onChange={onInputChange("last_name")}
                placeholder="last_name"
              />
            </FormGroup>
            <FormGroup>
              <TextInput
                value={formValues.phone_number}
                onChange={onInputChange("phone_number")}
                placeholder="phone_number"
              />
            </FormGroup> */}
          </div>
          <div style={{ width: "50%" }}>
            {/*<FormGroup>
              <SelectInput
                value={formValues.gender}
                onChange={onInputChange("gender")}
                placeholder="gender"
              >
                <SelectOption value=""></SelectOption>
                <SelectOption value="male">male</SelectOption>
                <SelectOption value="female">female</SelectOption>
              </SelectInput>
            </FormGroup> */}
            <FormGroup>
              <TextInput
                value={formValues.password}
                onChange={onInputChange("password")}
                placeholder="password"
              />
            </FormGroup>
            {/*      <FormGroup>
              <TextInput
                value={formValues.password_confirm}
                onChange={onInputChange("password_confirm")}
                placeholder="password_confirm"
              /> */}
            {/*        </FormGroup>
            <FormGroup>
              <TextInput value={formValues.state} onChange={onInputChange("state")} placeholder="state" />
            </FormGroup>
            <FormGroup>
              <TextInput value={formValues.city} onChange={onInputChange("city")} placeholder="city" />
            </FormGroup>
            <FormGroup>
              <TextInput value={formValues.center} onChange={onInputChange("center")} placeholder="center" />
            </FormGroup> */}
            <FormGroup>
              <Submit onClick={onFormSubmit}>تسجيل/</Submit>
            </FormGroup>
          </div>
        </div>
      </FormWrapper>
    </RegisterWrapper>
  );
}
