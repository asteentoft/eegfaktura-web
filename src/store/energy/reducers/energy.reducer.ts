import {createReducer} from "@reduxjs/toolkit";
import {metaAdapter, initialState, reportAdapter, participantReportAdapter} from "../states";
import {clearEnergyState, fetchEnergyReportV2, setSelectedPeriod} from "../actions";
import {SelectedPeriod} from "../../../models/energy.model";

const reportIdToPeriod = (id: string):SelectedPeriod => {
  const [type, year, month] = id.split('/')
  return {type: type as 'YH' | "YQ" | 'YM' | 'Y', year: Number(year), segment: Number(month)}
}

export const reducer = createReducer(initialState, builder =>
  builder
    .addCase(setSelectedPeriod, (state, action) => {
      return {...state, selectedPeriod: action.payload}
    })
    .addCase(fetchEnergyReportV2.fulfilled, (state, action) => {
      const {report} = action.payload
      // state.selectedPeriod = reportIdToPeriod(report.id)
      state.totalConsumption = report.totalConsumption
      state.totalProduction = report.totalProduction
      participantReportAdapter.setAll(state.participantReports, report.participantReports)
      metaAdapter.setAll(state.meta, report.meta)
    })
    .addCase(fetchEnergyReportV2.rejected, (state, action) => {
      participantReportAdapter.removeAll(state.participantReports)
      metaAdapter.removeAll(state.meta)
    })
    .addCase(clearEnergyState, (state, action) => {
      participantReportAdapter.removeAll(state.participantReports)
      metaAdapter.removeAll(state.meta)
    })
);
