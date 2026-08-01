using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSocialStatsToInfluencer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AudienceAgeRange",
                table: "Influencers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AudienceGenderSplit",
                table: "Influencers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AudienceTopLocations",
                table: "Influencers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InstagramAvgViews",
                table: "Influencers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InstagramFollowers",
                table: "Influencers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InstagramStoryViews",
                table: "Influencers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InstagramUrl",
                table: "Influencers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StatsUpdatedAt",
                table: "Influencers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TikTokAvgViews",
                table: "Influencers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TikTokFollowers",
                table: "Influencers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TikTokUrl",
                table: "Influencers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AudienceAgeRange",
                table: "Influencers");

            migrationBuilder.DropColumn(
                name: "AudienceGenderSplit",
                table: "Influencers");

            migrationBuilder.DropColumn(
                name: "AudienceTopLocations",
                table: "Influencers");

            migrationBuilder.DropColumn(
                name: "InstagramAvgViews",
                table: "Influencers");

            migrationBuilder.DropColumn(
                name: "InstagramFollowers",
                table: "Influencers");

            migrationBuilder.DropColumn(
                name: "InstagramStoryViews",
                table: "Influencers");

            migrationBuilder.DropColumn(
                name: "InstagramUrl",
                table: "Influencers");

            migrationBuilder.DropColumn(
                name: "StatsUpdatedAt",
                table: "Influencers");

            migrationBuilder.DropColumn(
                name: "TikTokAvgViews",
                table: "Influencers");

            migrationBuilder.DropColumn(
                name: "TikTokFollowers",
                table: "Influencers");

            migrationBuilder.DropColumn(
                name: "TikTokUrl",
                table: "Influencers");
        }
    }
}
