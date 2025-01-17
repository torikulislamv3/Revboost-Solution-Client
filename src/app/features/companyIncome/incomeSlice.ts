import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { axiosSecure } from "../../hooks/useAxiosSecure";

// Define TypeScript interfaces
export interface IncomeEntry {
  incomeId: string;
  amount: number;
  source: string;
  date: string; // ISO string
}

export interface IncomeCollection {
  userId: string;
  userEmail: string;
  incomeEntries: IncomeEntry[];
}

interface IncomeState {
  incomeCollection: IncomeCollection | null;
  loading: boolean;
  error: string | null;
}

const initialState: IncomeState = {
  incomeCollection: null,
  loading: false,
  error: null,
};

// Thunk to fetch income collection
export const fetchIncomeCollection = createAsyncThunk<
  IncomeCollection,
  string,
  { rejectValue: string }
>("income/fetchIncomeCollection", async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosSecure.get<IncomeCollection>(
      `/income/${userId}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch income collection"
    );
  }
});

// Thunk to add a new income entry
export const addIncomeEntry = createAsyncThunk<
  IncomeCollection,
  { userId: string; userEmail: string; entry: IncomeEntry },
  { rejectValue: string }
>(
  "income/addIncomeEntry",
  async ({ userId, userEmail, entry }, { rejectWithValue }) => {
    try {
      const response = await axiosSecure.post<IncomeCollection>(
        `/income/add-income-entry`,
        { userId, userEmail, entry }
      );
      console.log("income post request", response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add income entry"
      );
    }
  }
);

const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchIncomeCollection
    builder.addCase(fetchIncomeCollection.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchIncomeCollection.fulfilled,
      (state, action: PayloadAction<IncomeCollection>) => {
        state.loading = false;
        state.incomeCollection = action.payload;
      }
    );
    builder.addCase(fetchIncomeCollection.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    });

    // Handle addIncomeEntry
    builder.addCase(addIncomeEntry.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addIncomeEntry.fulfilled,
      (state, action: PayloadAction<IncomeCollection>) => {
        state.loading = false;
        state.incomeCollection = action.payload;
      }
    );
    builder.addCase(addIncomeEntry.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    });
  },
});

export default incomeSlice.reducer;
