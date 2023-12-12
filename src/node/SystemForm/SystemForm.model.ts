
export interface SystemFormModel extends Model {
    formid?: string;
    description?: string;
    iscustomizable?: {
        Value: boolean;
        CanBeChanged: boolean;
    };
    canbedeleted?: {
        Value: boolean;
        CanBeChanged: boolean;
    };
    ismanaged?: boolean;
    name?: string;
    objecttypecode?: string;
    formjson?: string;
    formxml?: string;
}

export interface FormJson {
    FormId: string;
    Tabs: {
        $values: FormJsonTab[];
    };
    Header: HeaderFooter;
    Footer: HeaderFooter;
}

interface HeaderFooter {
    Controls: {
        $values: FormJsonControl[];
    }
}

export interface FormJsonTab {
    Name: string;
    Columns: {
        $values: FormJsonColumn[];
    }
}

export interface FormJsonColumn {
    Sections: {
        $values: FormJsonSection[];
    }
}

export interface FormJsonSection {
    Name: string;
    Rows: {
        $values: FormJsonRow[];
    }
}

export interface FormJsonRow {
    Cells: {
        $values: Cell[];
    }
}

interface Cell {
    Control: FormJsonControl;
}

export interface FormJsonControl {
    DataFieldName: string;
    Id: string;
    Type: number;
}
