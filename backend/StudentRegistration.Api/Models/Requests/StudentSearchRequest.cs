namespace StudentRegistration.Api.Models.Requests
{
    public class StudentSearchRequest
    {
        public string? SearchTerm { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
