import { render, screen } from "@testing-library/react";
import MailView from "../MailView";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store from "../../store/store";

// Mock useParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    box: "inbox",
    mailId: "123"
  })
}));

// Fake login so Redux has an email
beforeEach(() => {
  store.dispatch({
    type: "auth/login",
    payload: { email: "abc@example.com" }
  });
});

// Render helper with real route
const renderWithProviders = (ui) => {
  window.history.pushState({}, "", "/mail/inbox/123");

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/mail/:box/:mailId" element={ui} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

describe("MailView Component", () => {
  const emailKey = "abc_example_com";

  // --------------------------------------
  // 1. Load mail content
  // --------------------------------------
  it("loads and displays mail content", async () => {
    fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          subject: "Hello World",
          message: "<p>Mail content</p>",
          read: false,
          from: "abc@example.com"
        })
    });

    renderWithProviders(<MailView />);

    expect(await screen.findByText("Hello World")).toBeInTheDocument();
    expect(screen.getByText("Mail content")).toBeInTheDocument();
  });

  // --------------------------------------
  // 2. Mark unread inbox mail as read
  // --------------------------------------
  it("marks mail as read when opened", async () => {
    global.fetch = jest
      .fn()
      // First fetch = mail data
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            subject: "New Mail",
            message: "Test message",
            read: false,
            from: "abc@example.com"
          })
      })
      // Second fetch = PATCH call
      .mockResolvedValueOnce({
        json: () => Promise.resolve({})
      });

    renderWithProviders(<MailView />);

    await screen.findByText("New Mail");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/mails/inbox/${emailKey}/123.json`),
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ read: true })
      })
    );
  });

  // --------------------------------------
  // 3. Shows metadata
  // --------------------------------------
  it("shows correct metadata", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          subject: "Meta Test",
          message: "",
          read: true,
          from: "sender@mail.com",
          to: "receiver@mail.com",
          date: 1725859911111
        })
    });
    

    renderWithProviders(<MailView />);

    expect(await screen.findByText(/From:/i)).toBeInTheDocument();
  });
});
