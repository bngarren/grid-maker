import { renderHook, act } from "@testing-library/react-hooks";
import user from "@testing-library/user-event";
import { render, screen, waitFor } from "../../test-utils";
import { useImporter } from "./useImporter";
import ImportSection from "../Settings/ImportSection";

const testData = {
  pass: {
    gridData: [
      {
        bed: "1",
        lastName: "Doe",
        firstName: "John",
        teamNumber: "2",
        oneLiner: "3yoM with asthma",
        contingencies: ["Pulm HTN"],
        contentType: "simple",
        simpleContent: "Make him better",
        nestedContent: [],
        bottomText: "Floor",
      },
    ],
  },
  empty: {},
};

describe("useImporter", () => {
  it("has correct initial state", () => {
    const { result: hook } = renderHook(() => useImporter());
    expect(hook.current.file).toBe(null);
    expect(hook.current.importedData).not.toBe(true);
    expect(hook.current.status).toBe(hook.current.STATUS.Empty);
    expect(hook.current.error).not.toBe(true);
  });

  it("uploads file and adds file to state", async () => {
    const { result: hook } = renderHook(() => useImporter());
    render(<ImportSection />);
    const _data = JSON.stringify(testData.pass);
    const blob = new Blob([_data]);
    const file = new File([blob], "testData.json", {
      type: "application/json",
    });

    File.prototype.text = jest.fn().mockResolvedValue(_data);

    const inputElement = screen.getByLabelText(/import grid/i);

    user.upload(inputElement, file);

    act(() => {
      hook.current.upload({ target: inputElement });
    });

    expect(inputElement.files[0]).toStrictEqual(file);
    await waitFor(() => expect(hook.current.file).not.toBe(null));
  });

  it("shows error message on invalid files and show disabled accept button and enabled cancel button", async () => {
    const { result: hook } = renderHook(() => useImporter());
    render(<ImportSection />);
    const _data = JSON.stringify(testData.empty);
    const blob = new Blob([_data]);
    const file = new File([blob], "testData.json", {
      type: "application/json",
    });

    File.prototype.text = jest.fn().mockResolvedValue(_data);

    const inputElement = screen.getByLabelText(/import grid/i);

    expect(hook.current.error).toBe(false);

    user.upload(inputElement, file);

    act(() => {
      hook.current.upload({ target: inputElement });
    });

    await waitFor(() => expect(hook.current.error).toBe(true));
    const errorMessageElement = screen.getByText(
      /error\. there was a problem with the file or corrupted data\./i
    );
    const acceptButtonElement = screen.getByRole("button", { name: /accept/i });
    const cancelButtonElement = screen.getByRole("button", { name: /cancel/i });

    expect(errorMessageElement).toBeVisible();
    expect(acceptButtonElement).toBeDisabled();
    expect(cancelButtonElement).toBeVisible();

    user.click(cancelButtonElement);

    expect(errorMessageElement).not.toBeVisible();
    expect(acceptButtonElement).not.toBeVisible();
    expect(cancelButtonElement).not.toBeVisible();
  });
});