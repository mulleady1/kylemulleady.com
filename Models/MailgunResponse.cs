using System.Runtime.Serialization;

namespace KM.Models
{
    [DataContract]
	public class MailgunResponse
    {
		[DataMember(Name="id")]
		public string Id { get; set; }
        
		[DataMember(Name="message")]
		public string Message { get; set; }
        
    }
}
