import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    employee: JSON.parse(window?.localStorage.getItem('employee')) ?? {},
};

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        setEmployee(state, action) {
            console.log(action.payload);
            state.employee = action.payload;
            localStorage.setItem('employee', JSON.stringify(action.payload));
        },
        logout(state) {
            state.employee = null;
            localStorage?.removeItem('token');
            localStorage?.removeItem('employee');
        },
    },
});
export default employeeSlice.reducer;

export function SetEmployee(employee) {
    return (dispatch, getState) => {
        dispatch(employeeSlice.actions.setEmployee(employee));
    };
}
export function Logout() {
    return (dispatch, getState) => {
        dispatch(employeeSlice.actions.logout());
    };
}
