using System.Runtime.Serialization;

namespace KM.Models
{
    [DataContract]
	public class MailgunResult
    {
		[DataMember(Name="id")]
		public string Id { get; set; }
        
		[DataMember(Name="message")]
		public string Message { get; set; }
        
		public bool Success { get; set; }
    }
}
