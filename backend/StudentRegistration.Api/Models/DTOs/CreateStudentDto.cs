﻿using System.ComponentModel.DataAnnotations;

namespace StudentRegistration.Api.Models.DTOs
{
    public class CreateStudentDto
    {
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [MaxLength(16)]
        public string Mobile { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(12)]
        public string NIC { get; set; } = string.Empty;

        [Required]
        public DateTime DateOfBirth { get; set; }

        [MaxLength(500)]
        public string? Address { get; set; } = string.Empty;

        public string? ProfileImageBase64 { get; set; }

        public string? ImageContentType { get; set; }
    }
}
