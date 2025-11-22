import { render, screen } from "@testing-library/react";
import MailView from "../MailView";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../../store/store";


// Helper wrapper (since MailView uses Redux + Router)
const renderWithProviders = (ui) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};


describe("MailView Component", () => {

  // 1. Should load mail data and display subject + body
  it("loads and displays mail content", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            subject: "Hello World",
            message: "<p>Mail content</p>",
            read: false,
            from: "abc@example.com"
          })
      })
    );

    renderWithProviders(<MailView />);

    expect(await screen.findByText("Hello World")).toBeInTheDocument();
    expect(screen.getByText("Mail content")).toBeInTheDocument();
  });



  // 2. Should mark unread inbox mail as read
  it("marks mail as read when opened", async () => {

    global.fetch = jest.fn()
      // First fetch → mail data
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            subject: "New Mail",
            message: "Test message",
            read: false,
            from: "abc@example.com"
          })
      })
      // Second fetch → PATCH call (mark read)
      .mockResolvedValueOnce({
        json: () => Promise.resolve({})
      });

    renderWithProviders(<MailView />);

    // Wait for mail to load
    await screen.findByText("New Mail");

    // Check PATCH request
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/inbox/"),
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ read: true })
      })
    );
  });



  // 3. Should show From/To metadata
  it("shows correct metadata", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            subject: "Meta Test",
            message: "",
            read: true,
            from: "sender@mail.com",
            to: "receiver@mail.com",
            date: 1725859911111
          })
      })
    );

    renderWithProviders(<MailView />);

    expect(await screen.findByText(/From:/i)).toBeInTheDocument();
  });

});
