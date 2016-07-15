
using System.Text;

namespace KM.Models.ViewModels
{
    public class MessageViewModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }

		public string ToHtmlString()
		{
			var sb = new StringBuilder();
			sb.Append($"<div><b>Name:</b> {this.Name}</div>");
			sb.Append($"<div><b>Email:</b> {this.Email}</div>");
			sb.Append($"<div style=\"white-space:pre-wrap;\"><b>Message:</b> {this.Message}</div>");
			return sb.ToString();
		}

    }
}
