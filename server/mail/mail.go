package mail

import (
	"fmt"
	"net/smtp"

	"github.com/jordan-wright/email"
)

type EmailSender interface {
	SendEmail(
		subject string,
		content string,
		to string,
		cc []string,
		bcc []string,
		attachFiles []string,
	) error

	SendBroadcastEmail(
		subject string,
		content string,
		to []string,
		cc []string,
		bcc []string,
		attachFiles []string,
	) error
}

type GmailSender struct {
	Name              string 
	FromEmailAddress  string 
	FromEmailPassword string
}

const (
	smtpAuthAddress = "smtp.gmail.com"
	smtpAuthPort    = "587" 
)

func (sender *GmailSender) SendEmail(
	subject string,
	content string,
	to string,
	cc []string,
	bcc []string,
	attachFiles []string,
) error {
	e := email.NewEmail()
	e.From = fmt.Sprintf("%s <%s>", sender.Name, sender.FromEmailAddress)
	e.Subject = subject
	e.HTML = []byte(content)
	e.To = []string{to}
	e.Cc = cc
	e.Bcc = bcc

	for _, f := range attachFiles {
		if _, err := e.AttachFile(f); err != nil {
			return fmt.Errorf("failed to attach file %s: %w", f, err)
		}
	}

	auth := smtp.PlainAuth("", sender.FromEmailAddress, sender.FromEmailPassword, smtpAuthAddress)

	err := e.Send(smtpAuthAddress+":"+smtpAuthPort, auth)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	return nil
}

func (sender *GmailSender) SendBroadcastEmail(
	subject string,
	content string,
	to []string,
	cc []string,
	bcc []string,
	attachFiles []string,
) error {
	e := email.NewEmail()
	e.From = fmt.Sprintf("%s <%s>", sender.Name, sender.FromEmailAddress)
	e.Subject = subject
	e.HTML = []byte(content)
	e.To = to
	e.Cc = cc
	e.Bcc = bcc

	for _, f := range attachFiles {
		if _, err := e.AttachFile(f); err != nil {
			return fmt.Errorf("failed to attach file %s: %w", f, err)
		}
	}

	auth := smtp.PlainAuth("", sender.FromEmailAddress, sender.FromEmailPassword, smtpAuthAddress)

	err := e.Send(smtpAuthAddress+":"+smtpAuthPort, auth)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	return nil
}
