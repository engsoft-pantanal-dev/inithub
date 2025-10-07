from src.config import env
from src.schemas.sheets import TestCaseRow

import gspread
from google.oauth2.service_account import Credentials

import importlib.metadata


scopes = ["https://www.googleapis.com/auth/spreadsheets"]
creds = Credentials.from_service_account_file("credentials.json", scopes=scopes)
client = gspread.authorize(creds)

sheet_id = env.GOOGLE_SHEET_ID
workbook = client.open_by_key(sheet_id)


def get_test_cases_sheet():
    worksheet_list = map(lambda x: x.title, workbook.worksheets())

    new_worksheet_name = f"Test cases v{importlib.metadata.version('init-agent')}"

    if new_worksheet_name in worksheet_list:
        sheet = workbook.worksheet(new_worksheet_name)
    else:
        sheet = workbook.add_worksheet(new_worksheet_name, rows=10, cols=10)

    titles = [
        "Modelo",
        "User ID",
        "Session ID",
        "Prompt ID",
        "Criado em",
        "Usuário",
        "Agente",
        "Metadados",
        "Contextos",
    ]

    sheet.update("A1:I1", [titles])  # type: ignore
    sheet.format("A1:I1", {"textFormat": {"bold": True}})

    sheet.freeze(rows=1)

    # Disable text wrapping for better readability
    # _apply_text_wrap(
    #     sheet, ["A:A", "B:B", "C:C", "D:D", "E:E", "F:F", "G:G", "H:H", "I:I"]
    # )

    sheet.format(
        "A1:I1000",
        {
            "verticalAlignment": "TOP",
            "backgroundColorStyle": {
                "rgbColor": {"red": 0.98, "green": 0.98, "blue": 0.98}
            },
        },
    )

    return sheet


def add_test_case(sheet: gspread.Worksheet, test_case: TestCaseRow):
    sheet.append_row(
        [
            test_case.get("model") or "unknown-model",
            test_case.get("user_id") or "",
            test_case.get("session_id") or "",
            test_case.get("prompt_id") or "",
            test_case.get("created_at") or "",
            test_case.get("user_response") or "",
            test_case.get("agent_response") or "",
            test_case.get("response_metadata") or "",
            str(test_case.get("retrieved_contexts") or []),
        ]
    )


def _apply_text_wrap(sheet: gspread.Worksheet, list_col_range: list[str]):
    for col_range in list_col_range:
        sheet.format(col_range, {"wrapStrategy": "WRAP"})
