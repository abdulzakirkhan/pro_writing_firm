import { createSlice } from '@reduxjs/toolkit';
import { sharedApi } from '../sharedApi/sharedApi';

const sharedSlice = createSlice({
  name: 'shared',
  initialState: {
    isMicPermissionEnable: false,
    isBottomSheetOpen: false,
    isSkipUpdateScreen: false,
    isRecurringOrder: false,
    recurringOrderDiscount: null,
    toggleDrawer: 1,
    minimumCardAmount:0,
    serviceChargePercentage:0,
    vatFeePercentage:0,
    userCurrencyCode:'',
  },
  reducers: {
    changeMicPermissionEnable: (state, action) => {
      state.isMicPermissionEnable = action.payload;
    },
    changeIsBottomSheetOpen: (state, action) => {
      state.isBottomSheetOpen = action.payload;
    },
    changeIsSkipUpdateScreen: (state, action) => {
      state.isSkipUpdateScreen = action.payload;
    },
    changeIsRecurringOrder: (state, action) => {
      state.isRecurringOrder = action.payload;
    },
    changeRecurringOrderDiscount: (state, action) => {
      state.recurringOrderDiscount = action.payload;
    },
    changeToggleDrawer: (state, action) => {
      state.toggleDrawer = state.toggleDrawer + 1;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      sharedApi.endpoints.getStandardValues.matchFulfilled,
      (state, { payload }) => {
        state.minimumCardAmount=Number(payload?.result?.[0]?.minimumCardAmount);
        state.serviceChargePercentage=Number(payload?.result?.[0]?.servicecharges);
        state.vatFeePercentage=Number(payload?.result?.[0]?.vat);
        state.userCurrencyCode=payload?.result?.[0]?.userCurrency ?? '';
      }
    )
  },
});

export const {
  changeMicPermissionEnable,
  changeIsBottomSheetOpen,
  changeIsSkipUpdateScreen,
  changeIsRecurringOrder,
  changeRecurringOrderDiscount,
  changeToggleDrawer,
} = sharedSlice.actions;

export default sharedSlice.reducer;
