<template>
  <div class="w-full">
    <div class="dx-viewport">
      <DxPivotGrid
        :data-source="dataSource"
        @exporting=""
        :show-column-grand-totals="false"
        :show-row-grand-totals="false"
        :show-row-totals="false"
        :show-column-totals="false"
      >
      </DxPivotGrid>
    </div>
  </div>
</template>
<script setup lang="ts">
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { DxPivotGrid, DxExport } from "devextreme-vue/pivot-grid";
import GarageReportLoad08Model from "@/models/GarageReportLoad08Model";

// import { Workbook } from 'exceljs';
// import saveAs from 'file-saver';
// import { exportPivotGrid } from 'devextreme/excel_exporter';

const { data } = await useFetch(
  "https://192.168.12.159:9001/api/v1/Common/Test1"
);

var newData = data.value as GarageReportLoad08Model[];

newData.forEach((item) => {
  item.km_Date = new Date(item.km_Date).toLocaleDateString("tr-TR");
});

watch(
  () => data.value,
  (value) => {
    console.log(value);
  }
);
var dataSource = new PivotGridDataSource({
  fields: [
    { dataField: "alpertra_Fark", area: "data", summaryType: "min" },
    {
      dataField: "alpertra_Km",
      area: "data",
      summaryType: "min",
    },
    { dataField: "alpertra_Tek", area: "data", summaryType: "min" },
    { dataField: "arvento_Km", area: "data", summaryType: "min" },
    { dataField: "vizyon_Fark", area: "data", summaryType: "min" },
    { dataField: "vizyon_Km", area: "data", summaryType: "min" },
    { dataField: "vizyon_Tek", area: "data", summaryType: "min" },
    { dataField: "device_Code", area: "row", expanded: true },
    { dataField: "general_Location_ID", area: "row", expanded: true },
    { dataField: "general_Location_ID_1", area: "row", expanded: false },
    { dataField: "general_Location_ID_2", area: "row", expanded: false },
    { dataField: "vehicle_ID", area: "row", expanded: false },
    { dataField: "vehicle_Plate", area: "row", expanded: false },
    { dataField: "km_Date", area: "column", dataType: "string" },
  ],
  store: {
    data: newData || [],
    type: "array",
  },
});
</script>
