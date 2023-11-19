using System.ComponentModel.DataAnnotations; //Should be good but need to check schema

namespace ReservationApp.Models
{
    public class User
    {
        [Key]
        public long NetID { get; set; }

        [Required]
        [StringLength(255)]
        public required string Name { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        public bool Is_Faculty { get; set; }
        public bool Is_Student { get; set; }
        public bool Is_Admin { get; set; }
    }
}