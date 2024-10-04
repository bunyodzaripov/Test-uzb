import React from "react";
import { Table } from "antd";

export default function UniversalTable({
   columns,
   dataSource,
   pagination,
   handleChange,
}) {
   return (
      <Table
         columns={columns}
         dataSource={dataSource}
         pagination={pagination}
         onChange={(pagination) => handleChange(pagination)}
         bordered
      />
   );
}
