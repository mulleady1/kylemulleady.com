
using System.Text;

namespace KM.Models
{
    public class MailgunMessage
    {
        public string From { get; set; }

        public string To { get; set; }

        public string Subject { get; set; }

        public string Html { get; set; }

        public string ToQueryString()
        {
            var sb = new StringBuilder();
            sb.Append($"from={this.From}");
            sb.Append($"&to={this.To}");
            sb.Append($"&subject={this.Subject}");
            sb.Append($"&html={this.Html}");
			return sb.ToString();
        }

    }
}
